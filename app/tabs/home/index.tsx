import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import React from "react";
import Headerspace from "~/components/HeaderSpace";
import { Stack } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Flame } from "~/lib/icons";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

const Home = () => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        
        setTimeout(() => setRefreshing(false), 500);
    }, []);
    return (
        <>
            <Stack.Screen options={{headerShown:false}} />
            <Headerspace/>
            <View id="profileHeader" className="bg-background flex-row items-center justify-center p-4">
                <Text className="text-4xl font-semibold text-foreground">Welcome Back</Text>
            </View>
            <ScrollView className="bg-background" >
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
                                    <Text className="text-primary text-2xl font-bold">7 Days</Text>
                                    <Text className="text-primary text-xl font-semibold">Best: 9 days</Text>
                                </View>
                                <Progress value={77} className="h-6" />
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