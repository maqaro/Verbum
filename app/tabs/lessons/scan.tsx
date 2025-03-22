import { Stack, useRouter } from 'expo-router';
import { Image, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Headerspace from '~/components/HeaderSpace';
import { Text } from '~/components/ui/text';
import { Camera, ChevronLeft, CirclePlus, Upload } from '~/lib/icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import axios from 'axios';

const Scan = () => {
    const router = useRouter();
    const [scanUri, setScanUri] = useState<string | null>(null);
    const [validScan, setValidScan] = useState<boolean>(false);

    const pickScan = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setScanUri(result.assets[0].uri);
        }
        
    };

    const takeScan = async () => {

    }

    const analyseScan = async () => {
        if (!scanUri) return;
        const key = 'AIzaSyDVYXDuMx3-9Tclhm5AEYxsbY4r4D2-gzk';

        const base64Image = await FileSystem.readAsStringAsync(scanUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const requestBody = {
            requests: [
                {
                    image: {
                        content: base64Image,
                    },
                    features: [
                        {
                            type: 'TEXT_DETECTION',
                        },
                    ],
                },
            ],
        };

        try {
            const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, requestBody);
            const data = response.data;
            const detections = data.responses[0].textAnnotations;
            console.log('Detected Text:', data);
        } catch (error) {
            console.error('Error analyzing scan:', error);
        }
    };

    const completeScan = () => {
        setValidScan(true);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Headerspace />
            <View className="bg-background flex-row items-center justify-between p-4">
                <TouchableOpacity
                    className="bg-secondary p-2 rounded-full"
                    onPress={() => router.back()}
                >
                    <ChevronLeft className="color-primary"/>
                </TouchableOpacity>
                <Text className="text-4xl font-semibold text-foreground">Add Scan</Text>
                <View className="w-10" />
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
                            onPress={pickScan}
                        >
                            <Camera className="text-primary w-6 h-6"/>
                            <Text className="text-lg font-semibold text-primary">Open Camera</Text>
                        </Button>

                        <View className='w-full items-center justify-center'>
                            {scanUri ? (
                                <Image
                                    source={{ uri: scanUri }}
                                    className="w-full h-[50vh] rounded-[10px] mb-4"
                                />
                            ) : (
                                <View className='w-full h-[50vh] items-center justify-center'>
                                    <Text className='text-center text-xl font-semibold text-muted-foreground'>Scan some text!</Text>
                                </View>
                            )}
                        </View>
                        <Button
                            className="w-full bg-secondary flex-row items-center gap-2 rounded-xl"
                            onPress={analyseScan}
                        >
                            <CirclePlus className='text-primary' />
                            <Text className='text-primary'>Add Scan</Text>
                        </Button>
                    </Card>
                </View>
            </ScrollView>
        </>
    );
};

export default Scan;