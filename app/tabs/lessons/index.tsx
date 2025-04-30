import { Stack, useFocusEffect } from "expo-router";
import { View } from "react-native";
import Headerspace from "~/components/HeaderSpace";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { RefreshControl, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import QuizCard from "~/components/QuizCard";
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AddQuizAlert from "~/components/AddQuizAlert";

interface QuizListEntry{
    id: string;
    name: string;
    languageCode: string;
}

const Lessons = () => {
    const user = FIREBASE_AUTH.currentUser;
    const [tabValue, setTabValue] = useState('yourQuizzes');
    const [userQuizzesList, setUserQuizzesList] = useState<QuizListEntry[]>([]);
    const [savedQuizzesList, SetSavedQuizzesList] = useState<QuizListEntry[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
        
    const getQuizzes = async () => {
        if (user?.email){
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email));
            const data = userDoc.data();
            setUserQuizzesList(data?.quizzes.userQuizzes || []);
            SetSavedQuizzesList(data?.quizzes.savedQuizzes || []);
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getQuizzes();
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    useFocusEffect(
        useCallback(() => {
            getQuizzes();
        }, [])
    );

    return (
        <>
            <Stack.Screen options={{headerShown:false}} />
            <Headerspace/>
            <View id="profileHeader" className="bg-background flex-row items-center justify-center p-4">
                <Text className="text-4xl font-semibold text-foreground">Lessons</Text>
            </View>
            <View className="bg-background flex-1 p-6">
                <Tabs
                    value={tabValue}
                    onValueChange={setTabValue}
                >
                    <TabsList className="flex-row w-full">
                        <TabsTrigger value='yourQuizzes' className="flex-1">
                            <Text>Your Quizzes</Text>
                        </TabsTrigger>
                        <TabsTrigger value='savedQuizzes' className="flex-1">
                            <Text>Saved Quizzes</Text>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value='yourQuizzes' className="mb-24">
                        <AddQuizAlert/>

                        <ScrollView showsVerticalScrollIndicator={false} className="h-full">
                            <RefreshControl 
                                onRefresh={onRefresh}
                                refreshing={refreshing}    
                            />
                            <View className="flex-col w-full items-center mt-4">
                                {userQuizzesList && userQuizzesList.length > 0 ? (
                                    userQuizzesList.map((item, index) => (
                                        <QuizCard 
                                            key={index}
                                            name={item.name}
                                            progress={10}
                                            quizId={item.id}
                                            languageCode={item.languageCode}
                                        />
                                    ))
                                ) : (
                                    <View className="py-8 items-center">
                                        <Text className="text-lg text-muted-foreground">No quizzes found</Text>
                                        <Text className="text-sm text-muted-foreground mt-2">Create a new quiz to get started</Text>
                                    </View>
                                )}                      
                            </View>
                        </ScrollView>
                    </TabsContent>
                    <TabsContent value='savedQuizzes' className="mb-24">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <RefreshControl 
                                onRefresh={onRefresh}
                                refreshing={refreshing}    
                            />
                            <View className="flex-col w-full items-center mt-6">
                                { savedQuizzesList.length > 0 ? (
                                    savedQuizzesList.map((item, index) => (
                                        <QuizCard 
                                            key={index}
                                            name={item.name}
                                            progress={10}
                                            quizId={item.id}
                                            languageCode={item.languageCode}
                                        />
                                    ))
                                ) : (
                                    <View className="py-8 items-center">
                                        <Text className="text-lg text-muted-foreground">No quizzes found</Text>
                                        <Text className="text-sm text-muted-foreground mt-2">Save a new quiz to get started</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </TabsContent>
                </Tabs>
            </View>
        </>
    )
}

export default Lessons;