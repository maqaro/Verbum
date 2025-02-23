import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Headerspace from "~/components/HeaderSpace";
import { Stack } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Flame } from "~/lib/icons";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";

const Home = () => {
    const user = FIREBASE_AUTH.currentUser
    const [refreshing, setRefreshing] = useState(false);
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [highestStreak, setHighestStreak] = useState<number>(0);
    const [lastLoggedIn, setLastLoggedIn] = useState<Date | null>(null);
    const progressValue = highestStreak > 0 ? (currentStreak / highestStreak) * 100 : 0;

    const fetchUserData = async () => {
        if (user?.email){
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user?.email)); 
            if (userDoc.exists()) {
                const data = userDoc.data();
                setCurrentStreak(data?.currentStreak || 0);
                setHighestStreak(data?.highestStreak || 0);
                setLastLoggedIn(data?.lastLoggedIn ? new Date(data?.lastLoggedIn) : null);
            }
        }
    }

    const updateStreak = async () => {
        if (!user?.email) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email));
        if (!userDoc.exists()) return;

        const data = userDoc.data();
        const lastLogin = data.lastLoggedIn ? new Date(data.lastLoggedIn) : null;
        let newStreak = data.currentStreak || 0;

        if (lastLogin) {
            lastLogin.setHours(0, 0, 0, 0);
            
            // If last login was today, don't update anything
            if (lastLogin.getTime() === today.getTime()) {
                console.log('log in today')
                return;
            }
            
            // If last login was yesterday, increment streak
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLogin.getTime() === yesterday.getTime()) {
                newStreak += 1;
                console.log('log in yesterday, increment')
            } else {
                // If last login was more than a day ago, reset streak
                console.log('reset log in')
                newStreak = 1;
            }
        } else {
            console.log('first time')
            newStreak = 1;
        }

        await updateDoc(doc(FIREBASE_DB, "userInfo", user.email), {
            currentStreak: newStreak,
            lastLoggedIn: today.toISOString(),
            highestStreak: Math.max(newStreak, data.highestStreak || 0)
        });

        // Update local state
        setCurrentStreak(newStreak);
        setHighestStreak(Math.max(newStreak, data.highestStreak || 0));
        setLastLoggedIn(today);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserData();
        updateStreak();
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData();
            await updateStreak();
        };
        initializeData();
    }, []);

    return (
        <>
            <Stack.Screen options={{headerShown:false}} />
            <Headerspace/>
            <View id="profileHeader" className="bg-background flex-row items-center justify-center p-4">
                <Text className="text-4xl font-semibold text-foreground">Welcome Back</Text>
            </View>
            <ScrollView 
                className="bg-background"
                showsVerticalScrollIndicator={false}
            >
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
                <View className="bg-background flex-1 p-6">
                    <View>
                        <Card className="bg-card w-full mb-4">
                            <CardHeader className="flex-row align-center items-center pb-4">
                                <CardTitle>
                                    <Text className="text-4xl font-bold text-primary">Daily Streak</Text>
                                </CardTitle>
                                <Flame className="color-primary align-center ml-2" />
                            </CardHeader>
                            <CardContent >
                                <View className="flex-row justify-between items-end pb-1">
                                    <Text className="text-primary text-2xl font-bold">{currentStreak} Days</Text>
                                    <Text className="text-primary text-xl font-semibold">Best: {highestStreak} days</Text>
                                </View>
                                <Progress value={progressValue} className="h-6" />
                                <Text className="font-2xl text-primary/60 pt-2 font-semibold">Complete today's lesson to keep your streak!</Text>
                            </CardContent>
                        </Card>
                    </View>
                    <View>
                        <Card className="bg-card w-full mb-4">
                            <CardHeader className="flex-row align-center items-center pb-0">
                                <CardTitle>
                                    <Text className="text-4xl font-bold text-primary">Jump Back In</Text>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <View className="flex-col mt-4">
                                    <Text className="text-2xl font-semibold text-primary mb-2">Continue your last lesson</Text>
                                    <View className="flex-row items-center">
                                        <Avatar alt="Quiz Picture" className="w-16 h-16 mr-4">
                                            <AvatarFallback>
                                                <Text className="text-4xl text-primary font-bold">Q</Text>
                                            </AvatarFallback>
                                        </Avatar>
                                        <View className="flex-col ml-4">
                                            <Text className="text-2xl font-semibold text-primary">Quiz Name</Text>
                                            <TouchableOpacity>
                                                <Text className="text-lg font-semibold text-primary/60 underline">Test your knowledge → </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-col mt-4">
                                    <Text className="text-2xl font-semibold text-primary mb-2">Revisit an old Quiz</Text>
                                    <View className="flex-row items-center">
                                        <Avatar alt="Quiz Picture" className="w-16 h-16 mr-4">
                                            <AvatarFallback>
                                                <Text className="text-4xl text-primary font-bold">Q</Text>
                                            </AvatarFallback>
                                        </Avatar>
                                        <View className="flex-col ml-4">
                                            <Text className="text-2xl font-semibold text-primary">Quiz Name</Text>
                                            <TouchableOpacity>
                                                <Text className="text-lg font-semibold text-primary/60 underline">Test your knowledge → </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                    </View>
                    <View>
                        <Card className="bg-card w-full mb-4">
                            <CardHeader className="flex-row align-center items-center pb-4">
                                <CardTitle className="m-0 p-0">
                                    <Text className="text-4xl font-bold text-primary">Missions</Text>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Card className="bg-card w-full mb-4">
                                    <CardHeader className="flex-row align-center items-center pb-4">
                                        <CardTitle>
                                            <Text className="font">Complete 3 Lessons</Text>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Progress value={33} />
                                        <Text className="font-2xl text-primary/60 pt-2 font-semibold">1/3 Completed</Text>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card w-full mb-4">
                                    <CardHeader className="flex-row align-center items-center pb-4">
                                        <CardTitle>
                                            <Text className="font">Learn 4 New Words</Text>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Progress value={50} />
                                        <Text className="font-2xl text-primary/60 pt-2 font-semibold">2/4 Completed</Text>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card w-full mb-4">
                                    <CardHeader className="flex-row align-center items-center pb-4">
                                        <CardTitle>
                                            <Text className="font">Scan 1 Page</Text>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Progress value={0} />
                                        <Text className="font-2xl text-primary/60 pt-2 font-semibold">0/1 Completed</Text>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default Home;