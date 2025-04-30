import React, { useState } from 'react';
import { TouchableOpacity, View} from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Progress } from "~/components/ui/progress";
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB } from '~/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Quiz = () => {
    const user = FIREBASE_AUTH.currentUser;
    const [totalQuestions] = useState<number>(2);
    const [questionsCompleted, setQuestionsCompleted] = useState<number>(0);
    const [answeredCorrect, setAnsweredCorrect] = useState<number>(0);
    const [correctAnswer, setCorrect] = useState<String>('option 1')
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [words, setWords] = useState<string[]>(['option 1', 'option 2', 'option 3', 'option 4']);
    const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

    const progress = (questionsCompleted/totalQuestions) * 100;

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        
        setAnswerSubmitted(true);
        setQuestionsCompleted(prev => prev + 1);
        if (selectedAnswer === correctAnswer){
            setAnsweredCorrect(prev => prev + 1);
        }
    };

    const getOptionStyle = (option: string) => {
        if (!answerSubmitted) {
            return selectedAnswer === option
                ? 'border-primary bg-primary/10' 
                : 'border-border';
        }
        
        if (option === correctAnswer) {
            return 'border-green-500 bg-green-100';
        }
        
        if (selectedAnswer === option && selectedAnswer !== correctAnswer) {
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
        
        if (option === correctAnswer) {
            return 'font-semibold text-green-700';
        }
        
        if (selectedAnswer === option && selectedAnswer !== correctAnswer) {
            return 'font-semibold text-red-700';
        }
        
        return 'text-foreground';
    };

    const fetchData = () => {
        
    }

    const endQuiz = () => {
        setQuizCompleted(true);
        updateUserXP(answeredCorrect)
    }

    const updateUserXP = async (points: number) => {
        if (user?.email){
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user?.email)); 
            if (userDoc.exists()){
                const data = userDoc.data();
                await updateDoc(doc(FIREBASE_DB, "userInfo", user.email), {
                    points: data.points + Math.round(points * 1.5)
                });
            }
        }
    }

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        
        if (questionsCompleted >= totalQuestions) {
            endQuiz();
        } else {
            // TODO: update the questions
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
                    <Text className="text-4xl font-bold text-foreground">Select the correct answer</Text>
                </View>
                <View className='flex-1 flex justify-between'>
                    <View className='items-center px-6'>
                        <Card className='w-full h-80 p-6 rounded-2xl bg-card shadow-md'>
                            <View className="w-full h-full flex items-center justify-center">
                                <Text className='text-5xl font-semibold text-center text-foreground'>
                                    {correctAnswer}
                                </Text>
                            </View>
                        </Card>
                    </View>
                    
                    <View className='px-6 pb-6'>
                        <View className="flex-row flex-wrap justify-between mb-4">
                            {words.map((option) => (
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