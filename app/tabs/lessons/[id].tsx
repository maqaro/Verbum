import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from '~/components/ui/text';
import Headerspace from "~/components/HeaderSpace";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Camera, ChevronLeft, Play, SquarePen, Trash } from '~/lib/icons';
import { Card } from "~/components/ui/card";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {FIREBASE_DB } from "~/FirebaseConfig";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import FlagAvatar from "~/components/FlagAvatar";

const QuizInfo = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ quizData, setQuizData ] = useState<DocumentData>();

    const getQuiz = async () => {
        const quizDoc = await getDoc(doc(FIREBASE_DB, "quizzes", id as string));
        const data = quizDoc.data();
        setQuizData(data);
    }

    useFocusEffect(
        useCallback(() => {
            getQuiz();
        }, [])
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <Headerspace />
            <View className="bg-background flex-row items-center justify-between px-6 py-4 border-b border-border">
                <TouchableOpacity 
                    className="bg-secondary p-3 rounded-full shadow-md active:scale-95"
                    onPress={() => router.back()}
                >
                    <ChevronLeft className="text-primary w-6 h-6"/>
                </TouchableOpacity>
                
                <Text className="text-3xl font-bold text-foreground text-center flex-1">
                    {quizData?.info.name.slice(0, 16)}
                </Text>
                
                {quizData?.info.isOriginal == true ? (
                    <TouchableOpacity 
                        className="bg-secondary p-3 rounded-full shadow-md active:scale-95"
                    >
                        <SquarePen className="text-primary w-6 h-6" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        className="bg-red-600 p-3 rounded-full shadow-md active:scale-95"
                    >
                        <Trash className="text-primary w-6 h-6" />
                    </TouchableOpacity>
                )}
                
            </View>
            <ScrollView className="bg-background p-6">
                <View className="items-center">
                    <Avatar alt="country" className="w-32 h-32 rounded-full bg-muted shadow-lg mb-6">
                        <FlagAvatar languageCode={quizData?.info.languageCode} />
                    </Avatar>
                    <Card className="w-full p-6 rounded-2xl shadow-lg border border-border bg-card">
                        <View className="mb-6">
                            <Text className="text-4xl font-semibold text-foreground">Scans Added</Text>
                            <Text className="text-3xl font-bold text-primary/40">{ quizData?.info.scansAdded} Scans</Text>
                        </View>
                        <View className="mb-6">
                            <Text className="text-4xl font-semibold text-foreground">Times Played</Text>
                            <Text className="text-3xl font-bold text-primary/40">{ quizData?.info.timesPlayed} Plays</Text>
                        </View>
                        <View className="mb-6">
                            <Text className="text-4xl font-semibold text-foreground">Words Learnt</Text>
                            <Text className="text-3xl font-bold text-primary/40">{ quizData?.info.wordsLearnt} words</Text>
                        </View>
                        <View className="w-full">
                            <Button 
                                className={`w-full flex-row items-center justify-center gap-2 py-3 mb-4 rounded-xl active:scale-95 ${
                                    (!quizData?.words || quizData?.words.length < 1) 
                                    ? 'bg-secondary' 
                                    : 'bg-primary'
                                }`}
                                onPress={() => {
                                    if (!quizData?.words || quizData?.words.length < 1) {
                                        alert('This quiz has no words yet. Please add scans first.');
                                        return;
                                    }
                                    router.push({
                                        pathname: '/tabs/lessons/quiz',
                                        params: { 
                                            id: id,
                                        }
                                    });
                                }}
                                disabled={!quizData?.words || quizData?.words.length < 1}
                            >
                                <Play className={`w-6 h-6 ${
                                    (!quizData?.words || quizData?.words.length < 1) 
                                    ? 'text-primary' 
                                    : 'text-secondary'
                                }`}/>
                                <Text className={`text-lg font-semibold ${
                                    (!quizData?.words || quizData?.words.length < 1) 
                                    ? 'text-primary' 
                                    : 'text-secondary'
                                }`}>
                                    Play{(!quizData?.words || quizData?.words.length < 1) ? ' (Add scans first)' : ''}
                                </Text>
                            </Button>
                            <Button className="w-full flex-row items-center justify-center gap-2 py-3 bg-secondary rounded-xl active:scale-95"
                                onPress={() => {router.push({
                                    pathname: '/tabs/lessons/scan',
                                    params: { 
                                        id: id,
                                    }
                                });}}
                            >
                                <Camera className="text-primary w-6 h-6"/>
                                <Text className="text-lg font-semibold text-primary">Scan</Text>
                            </Button>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </>
    )
}

export default QuizInfo;
