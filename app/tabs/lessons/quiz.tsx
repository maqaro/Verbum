import React, { useCallback, useState, useEffect } from 'react';
import { TouchableOpacity, View} from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Progress } from "~/components/ui/progress";
import { Button } from '~/components/ui/button';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '~/FirebaseConfig';
import { doc, DocumentData, getDoc, updateDoc } from 'firebase/firestore';

const Quiz = () => {
    const user = FIREBASE_AUTH.currentUser;
    const { id } = useLocalSearchParams();
    const [quizData, setQuizData] = useState<DocumentData | null>(null);
    const [quizWords, setQuizWords] = useState<Array<{original: string, translated: string}>>([]);
    const [availableWords, setAvailableWords] = useState<Array<{original: string, translated: string}>>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(5);
    const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);
    const [answeredCorrect, setAnsweredCorrect] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<{original: string, translated: string} | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
    
    const progress = (questionsCompleted/totalQuestions) * 100;

    const getQuiz = async () => {
        try {
            const quizDoc = await getDoc(doc(FIREBASE_DB, "quizzes", id as string));
            if (!quizDoc.exists()) {
                alert("Quiz not found");
                router.back();
                return;
            }
            
            const data = quizDoc.data();
            setQuizData(data);
            
            if (data.words && data.words.length > 0) {
                setQuizWords(data.words);
                setAvailableWords([...data.words]);
                
                // Set a random number of questions between 5 and 10
                // but no more than the number of available words
                const maxQuestions = Math.min(data.words.length, 10);
                const randomQuestions = Math.max(5, Math.floor(Math.random() * (maxQuestions - 4)) + 5);
                setTotalQuestions(randomQuestions);
            } else {
                alert("This quiz has no words yet");
                router.back();
            }
        } catch (error) {
            console.error("Error loading quiz:", error);
            alert("Error loading quiz");
        }
    };

    useFocusEffect(
        useCallback(() => {
            getQuiz();
        }, [])
    );

    // Set up the quiz when words are loaded
    useEffect(() => {
        if (quizWords.length > 0) {
            prepareNextQuestion();
        }
    }, [quizWords]);

    // Prepare a new question with options
    const prepareNextQuestion = () => {
        if (availableWords.length === 0) {
            endQuiz();
            return;
        }
        
        // Get a random word from the remaining words
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const questionWord = availableWords[randomIndex];
        
        // Remove the selected word so it won't be repeated
        const updatedAvailableWords = [...availableWords];
        updatedAvailableWords.splice(randomIndex, 1);
        setAvailableWords(updatedAvailableWords);
        
        setCurrentQuestion(questionWord);
        
        // Create options (1 correct + 3 incorrect)
        let optionsArray = [questionWord.translated];
        
        // Get incorrect options from the full word pool (could include already used words for more options)
        const potentialIncorrectOptions = quizWords
            .filter(word => word.translated !== questionWord.translated)
            .map(word => word.translated);
        
        // Shuffle potential incorrect options
        const shuffledIncorrect = [...potentialIncorrectOptions].sort(() => Math.random() - 0.5);
        
        // Add incorrect options (up to 3)
        for (let i = 0; i < 3 && i < shuffledIncorrect.length; i++) {
            optionsArray.push(shuffledIncorrect[i]);
        }
        
        // If we don't have enough words, add placeholder options
        while (optionsArray.length < 4) {
            optionsArray.push(`Option ${optionsArray.length + 1}`);
        }
        
        // Shuffle options
        optionsArray = optionsArray.sort(() => Math.random() - 0.5);
        
        setOptions(optionsArray);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null || !currentQuestion) return;
        
        setAnswerSubmitted(true);
        setQuestionsCompleted(prev => prev + 1);
        
        if (selectedAnswer === currentQuestion.translated) {
            setAnsweredCorrect(prev => prev + 1);
        }
    };

    const getOptionStyle = (option: string) => {
        if (!answerSubmitted) {
            return selectedAnswer === option
                ? 'border-primary bg-primary/10' 
                : 'border-border';
        }
        
        if (option === currentQuestion?.translated) {
            return 'border-green-500 bg-green-100';
        }
        
        if (selectedAnswer === option && selectedAnswer !== currentQuestion?.translated) {
            return 'border-red-500 bg-red-100';
        }
        
        return 'border-border';
    };

    const getTextStyle = (option: string) => {
        if (!answerSubmitted) {
            return selectedAnswer === option
                ? 'font-semibold text-primary' 
                : 'text-foreground';
        }
        
        if (option === currentQuestion?.translated) {
            return 'font-semibold text-green-700';
        }
        
        if (selectedAnswer === option && selectedAnswer !== currentQuestion?.translated) {
            return 'font-semibold text-red-700';
        }
        
        return 'text-foreground';
    };

    const endQuiz = () => {
        setQuizCompleted(true);
        updateUserXP(answeredCorrect);
        updateQuizStats();
        updateLastPlayedQuiz(id as string);
    };

    const updateUserXP = async (points: number) => {
        if (user?.email) {
            try {
                const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user?.email)); 
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    await updateDoc(doc(FIREBASE_DB, "userInfo", user.email), {
                        points: data.points + Math.round(points * 1.5)
                    });
                }
            } catch (error) {
                console.error("Error updating user XP:", error);
            }
        }
    };
    
    const updateQuizStats = async () => {
        if (!id) return;
        
        try {
            // Update times played
            const currentTimesPlayed = quizData?.info?.timesPlayed || 0;
            
            await updateDoc(doc(FIREBASE_DB, "quizzes", id.toString()), {
                "info.timesPlayed": currentTimesPlayed + 1
            });
        } catch (error) {
            console.error("Error updating quiz stats:", error);
        }
    };

    const updateLastPlayedQuiz = async (quizId: string) => {
        if (user?.email) {
            try {
                await updateDoc(doc(FIREBASE_DB, "userInfo", user.email), {
                    lastPlayedQuizId: quizId
                });
            } catch (error) {
                console.error("Error updating last played quiz: ", error);
            }
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        
        if (questionsCompleted >= totalQuestions) {
            endQuiz();
        } else {
            prepareNextQuestion();
        }
    };

    if (quizCompleted) {
        return (
            <View className='bg-background flex-1 p-6'>
                <View className="flex-1 items-center justify-center">
                    <Card className='w-full p-8 rounded-2xl bg-card shadow-md'>
                        <Text className='text-4xl font-bold text-center text-foreground mb-6'>
                            Quiz Completed!
                        </Text>
                        
                        <View className="mb-8">
                            <Text className='text-2xl text-center text-foreground mb-2'>
                                Your Score
                            </Text>
                            <Text className='text-5xl font-bold text-center text-primary'>
                                {answeredCorrect}/{totalQuestions}
                            </Text>
                        </View>
                        
                        <View className="mb-8">
                            <Text className='text-2xl text-center text-foreground mb-2'>
                                Points Earned
                            </Text>
                            <Text className='text-5xl font-bold text-center text-green-500'>
                                +{Math.round(answeredCorrect * 1.5)}
                            </Text>
                        </View>
                        
                        <Button
                            className="w-full py-3 bg-primary"
                            onPress={() => router.back()}
                        >
                            <Text className="font-semibold text-lg text-primary-foreground">
                                Return to Lessons
                            </Text>
                        </Button>
                    </Card>
                </View>
            </View>
        );
    }

    return (
        <>
            <View className='bg-background flex-1'>
                <View className="bg-background flex-col items-center justify-center p-6 pt-10">
                    <View className='w-full pb-4'>
                        <Progress value={progress} className='h-6 w-full' indicatorClassName='bg-primary'/>
                    </View>
                    <Text className="text-4xl font-bold text-foreground">Select the correct translation</Text>
                </View>
                <View className='flex-1 flex justify-between'>
                    <View className='items-center px-6'>
                        <Card className='w-full h-80 p-6 rounded-2xl bg-card shadow-md'>
                            <View className="w-full h-full flex items-center justify-center">
                                <Text className='text-5xl font-semibold text-center text-foreground'>
                                    {currentQuestion?.original || 'Loading...'}
                                </Text>
                            </View>
                        </Card>
                    </View>
                    
                    <View className='px-6 pb-6'>
                        <View className="flex-row flex-wrap justify-between mb-4">
                            {options.map((option) => (
                                <TouchableOpacity 
                                    key={option}
                                    onPress={() => !answerSubmitted && setSelectedAnswer(option)}
                                    className={`w-[48%] mb-4 ${selectedAnswer === option ? 'opacity-100' : 'opacity-80'}`}
                                    disabled={answerSubmitted}
                                >
                                    <Card className={`p-4 rounded-lg border-2 h-48 flex items-center justify-center ${getOptionStyle(option)}`}>
                                        <Text className={`text-lg text-center ${getTextStyle(option)}`}>
                                            {option}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                        {answerSubmitted ? (
                            <Button
                                className="w-full py-3 bg-secondary"
                                onPress={handleNextQuestion}
                            >
                                <Text className="font-semibold text-lg text-primary">
                                    Next Question
                                </Text>
                            </Button>
                        ) : (
                            <Button
                                className={`w-full py-3 ${selectedAnswer === null ? 'bg-secondary/50' : 'bg-secondary'}`}
                                onPress={handleSubmit}
                                disabled={selectedAnswer === null}
                            >
                                <Text className={`font-semibold text-lg ${selectedAnswer === null ? 'text-primary/50' : 'text-primary'}`}>
                                    Submit
                                </Text>
                            </Button>
                        )}
                    </View>
                </View>
            </View>
        </>
    );
};

export default Quiz;