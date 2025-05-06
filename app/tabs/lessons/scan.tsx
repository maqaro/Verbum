import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, View, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Text } from '~/components/ui/text';
import { Camera, CirclePlus, Upload } from '~/lib/icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import axios, { AxiosResponse } from 'axios';
import { doc, DocumentData, getDoc, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '~/FirebaseConfig';

const Scan = () => {
    const user = FIREBASE_AUTH.currentUser;
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [scanUri, setScanUri] = useState<string | null>(null);
    const [validScan, setValidScan] = useState<boolean>(false);
    const [ocrResponse, setOcrResponse] = useState<any>(null);
    const [extractedWords, setExtractedWords] = useState<string[]>([]);
    const [translatedWords, setTranslatedWords] = useState<Array<{original: string, translated: string}>>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [quizData, setQuizData ] = useState<DocumentData>();

    const getQuiz = async () => {
        try {
            const quizDoc = await getDoc(doc(FIREBASE_DB, "quizzes", id as string));
            
            if (!quizDoc.exists()) {
                alert("Quiz not found. Please try again.");
                router.back();
                return;
            }
            
            const data = quizDoc.data();
            
            // Extract language code from the nested structure
            const languageCode = data.info?.languageCode || data.languageCode;
            
            if (!languageCode) {
                data.languageCode = "es"; // Default to Spanish if no language code
                alert("Warning: Quiz language not specified. Defaulting to Spanish.");
            } else {
                // Normalise the language code and add it to the top level for easier access
                data.languageCode = languageCode.toLowerCase();
            }
            
            setQuizData(data);
        } catch (error: any) {
            alert(`Error loading quiz: ${error.message}`);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (id) {
                getQuiz();
            } else {
                alert("No quiz ID provided");
                router.back();
            }
        }, [id])
    );

    const pickScan = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setScanUri(result.assets[0].uri);
            // Reset previous results when new image is selected
            setOcrResponse(null);
            setExtractedWords([]);
            setTranslatedWords([]);
        }
    };

    const takeScan = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        
        if (cameraPermission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setScanUri(result.assets[0].uri);
                // Reset previous results when new image is captured
                setOcrResponse(null);
                setExtractedWords([]);
                setTranslatedWords([]);
            }
        } else {
            alert('Camera permission is required to take a scan.');
        }
    };

    const readScan = async () => {
        if (!scanUri) return;
        
        if (!quizData) {
            alert("Quiz data not loaded yet. Please wait or try again.");
            return;
        }
        
        if (!quizData.languageCode) {
            alert("Quiz language not specified. Please contact support.");
            return;
        }
        
        setIsProcessing(true);
        try {            
            // First perform OCR
            const ocrResult = await performOCR();
            setOcrResponse(ocrResult);
            
            // Check if we got a valid OCR result
            if (!ocrResult || !ocrResult.responses || !ocrResult.responses[0] || !ocrResult.responses[0].textAnnotations) {
                alert('No text detected in the image. Please try a clearer image with text.');
                setValidScan(false);
                setIsProcessing(false);
                return;
            }
            
            const detectedLanguage = ocrResult.responses[0].textAnnotations[0].locale || "unknown";
            const requiredLanguage = quizData?.languageCode || "unknown";
                        
            // For Arabic, the Google Vision API might detect 'ar-*' variants
            const isValidLanguage = 
                requiredLanguage.toLowerCase() === detectedLanguage.toLowerCase() || 
                (requiredLanguage === 'ar' && detectedLanguage.startsWith('ar'));
            
            // Update state
            setValidScan(isValidLanguage);
            
            // Only proceed with word extraction and translation if language matches
            if (isValidLanguage) {
                // Extract words for translation
                const words = extractWordsFromOCR(ocrResult);
                setExtractedWords(words);
                
                if (words.length === 0) {
                    alert(`No valid words found in the text. Please try another image with clearer text.`);
                    setIsProcessing(false);
                    return;
                }
                
                // Then translate selected words
                if (words.length > 0) {
                    const translations = await translateWords(words);
                    setTranslatedWords(translations);
                    saveToDB(translations);
                }
            } else {
                alert(`This scan appears to be in ${detectedLanguage} but the quiz requires ${requiredLanguage}`);
            }
            
        } catch (error: any) {
            alert(`Error analysing scan: ${error.message || 'Please try again.'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const performOCR = async () => {
        if (!scanUri) return null;
        const key = 'AIzaSyDVYXDuMx3-9Tclhm5AEYxsbY4r4D2-gzk';
        
        // Get the language code, ensuring it's lowercase
        const languageCode = (quizData?.languageCode || quizData?.info?.languageCode || 'es').toLowerCase();

        const base64Image = await FileSystem.readAsStringAsync(scanUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const requestBody = {
            requests: [{
                image: { content: base64Image },
                features: [{ type: 'TEXT_DETECTION' }],
                imageContext: {
                    languageHints: [languageCode] // Hint the expected language
                }
            }]
        };


        try {
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
                requestBody
            );
            return response.data;
        } catch (error: any) {
            console.error('Error analysing scan:', error);
            throw error;
        }
    };

    // Extract meaningful words for translation
    const extractWordsFromOCR = (ocrData: any): string[] => {
        if (!ocrData || !ocrData.responses || ocrData.responses.length === 0) {
            return [];
        }

        // Extract individual words from textAnnotations
        const annotations = ocrData.responses[0].textAnnotations;
        
        if (!annotations || annotations.length < 2) { // Skip the first one as it contains the full text
            return [];
        }
        
        // Filter out words we want to translate
        // Start from index 1 as index 0 contains the complete text
        let words = annotations
            .slice(1) // Skip the first annotation which contains the full text
            .map((annotation: any) => annotation.description);
        
        // Get the language code, ensuring it's lowercase
        const languageCode = (quizData?.languageCode || quizData?.info?.languageCode || 'es').toLowerCase();
        
        // Apply language-specific filtering
        if (languageCode === 'ar') {
            // For Arabic, allow Arabic characters
            words = words.filter((word: string) => {
                return word.length > 1 && /^[\u0600-\u06FF]+$/.test(word);
            });
        } else if (languageCode === 'es') {
            // For Spanish, allow Spanish characters
            words = words.filter((word: string) => {
                return word.length > 2 && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/.test(word);
            });
        } else {
            // Default filter for other languages
            words = words.filter((word: string) => {
                return word.length > 2 && /^\p{L}+$/u.test(word);
            });
        }
        
            
        // Get unique words and limit to 10
        const uniqueWords = [...new Set<string>(words)].slice(0, 10);
        return uniqueWords;
    };

    // Translate the extracted words
    const translateWords = async (words: string[]): Promise<Array<{original: string, translated: string}>> => {
        if (!words || words.length === 0) {
            return [];
        }
        
        const key = 'AIzaSyDVYXDuMx3-9Tclhm5AEYxsbY4r4D2-gzk';
        
        // Get the language code, ensuring it's lowercase
        const languageCode = (quizData?.languageCode || quizData?.info?.languageCode || 'es').toLowerCase();
        
        try {
            const translations = await Promise.all(
                words.map(async (word) => {
                    const requestBody = {
                        q: word,
                        source: languageCode,
                        target: 'en',
                        format: 'text'
                    };
                    
                    const response = await axios.post(
                        `https://translation.googleapis.com/language/translate/v2?key=${key}`,
                        requestBody
                    );
                    
                    const translatedText = response.data?.data?.translations?.[0]?.translatedText;
                    
                    return {
                        original: word,
                        translated: translatedText || 'Translation failed'
                    };
                })
            );
            
            return translations;
        } catch (error: any) {
            alert(`Translation error: ${error.message || 'Unknown error'}`);
            return words.map(word => ({ original: word, translated: 'Translation failed' }));
        }
    };

    const saveToDB = async (translations: Array<{original: string, translated: string}> = []) => {
        if (user?.email){
            saveWords(translations.length > 0 ? translations : translatedWords);
            increasePoints();
        } else {
            console.error("User not logged in, can't save to database");
        }
    }

    const saveWords = async (wordsToSave: Array<{original: string, translated: string}> = []) => {
        try {


            // Check if words array exists, create it if it doesn't
            const currentWords = quizData?.words || [];
            
            // Create a new array with existing words plus new translated words
            const updatedWords = [...currentWords, ...wordsToSave];
            
            await updateDoc(doc(FIREBASE_DB, "quizzes", id.toString()), {
                words: updatedWords
            });
        } catch (error: any) {
            alert(`Error saving words: ${error.message}`);
        }
    }

    const increasePoints = async () => {
        try {
            const currentScans = quizData?.info?.scansAdded || 0;
            await updateDoc(doc(FIREBASE_DB, "quizzes", id.toString()), {
                "info.scansAdded": (currentScans + 1)
            });
        } catch (error: any) {
            console.error("Error updating scan count:", error);
        }
    }

    return (
        <>
            <View className="bg-background flex-row items-center justify-center p-4 pt-10">
                <Text className="text-4xl font-semibold text-foreground">Add Scan</Text>
            </View>
            <ScrollView className='bg-background p-6'>
                <View className='items-center'>
                    <Card className='w-full h-full p-6 rounded-2xl bg-card'>
                        <Button
                            className='w-full bg-secondary flex-row items-center gap-2 mb-4 rounded-xl'
                            onPress={pickScan}
                        >
                            <Upload className="text-primary w-6 h-6"/>
                            <Text className="text-lg font-semibold text-primary">Upload Scan</Text>
                        </Button>

                        <Button
                            className='w-full bg-secondary flex-row items-center gap-2 mb-4 rounded-xl'
                            onPress={takeScan}
                        >
                            <Camera className="text-primary w-6 h-6"/>
                            <Text className="text-lg font-semibold text-primary">Open Camera</Text>
                        </Button>

                        <View className='w-full items-center justify-center'>
                            {scanUri ? (
                                <Image
                                    source={{ uri: scanUri }}
                                    className="w-full h-[30vh] rounded-[10px] mb-4"
                                />
                            ) : (
                                <View className='w-full h-[30vh] items-center justify-center'>
                                    <Text className='text-center text-xl font-semibold text-muted-foreground'>Scan some text!</Text>
                                </View>
                            )}
                        </View>
                        
                        <Button
                            className="w-full bg-secondary flex-row items-center gap-2 rounded-xl mb-4"
                            onPress={readScan}
                            disabled={!scanUri || isProcessing}
                        >
                            <CirclePlus className='text-primary' />
                            <Text className='text-primary'>{isProcessing ? 'Processing...' : 'Analyse Scan'}</Text>
                        </Button>
                    </Card>
                </View>
            </ScrollView>
        </>
    );
};

export default Scan;