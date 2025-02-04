import { Stack } from "expo-router";
import { View } from "react-native";
import Headerspace from "~/components/HeaderSpace";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { CirclePlus } from "~/lib/icons";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import { RefreshControl, ScrollView } from "react-native";
import React from "react";

const Lessons = () => {
    const [tabValue, setTabValue] = React.useState('yourQuizzes');

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
                        <View className="pt-4 rounded-50">
                            <Button className="bg-secondary">
                                <CirclePlus className="color-primary p-4"/>
                            </Button>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <RefreshControl 
                                onRefresh={onRefresh}
                                refreshing={refreshing}    
                            />
                            <View className="flex-col w-full items-center mt-4">
                                <Card className="bg-card w-full mb-4">
                                    <CardContent className="flex-row pb-2 items-center">
                                        <View className="flex-1">
                                            <Text className="text-2xl text-primary font-bold">Quiz Name</Text>
                                            <Text className="text-primary/50 mb-4">Tap to Expand</Text>
                                            <Progress className="h-6" value={50} max={100}/>
                                        </View>
                                        <View className="p-4 pr-0 items-center">
                                            <Avatar alt="Avatar" className="w-24 h-24">
                                                <AvatarFallback>
                                                    <Text>JD</Text>
                                                </AvatarFallback>
                                            </Avatar>
                                        </View>
                                    </CardContent>
                                </Card>
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

                                <Card className="bg-card w-full mb-4">
                                    <CardContent className="flex-row pb-2 items-center">
                                        <View className="flex-1">
                                            <Text className="text-2xl text-primary font-bold">Quiz Name</Text>
                                            <Text className="text-primary/50 mb-4">Tap to Expand</Text>
                                            <Progress className="h-6" value={50} max={100}/>
                                        </View>
                                        <View className="p-4 pr-0 items-center">
                                            <Avatar alt="Avatar" className="w-24 h-24">
                                                <AvatarFallback>
                                                    <Text>JD</Text>
                                                </AvatarFallback>
                                            </Avatar>
                                        </View>
                                    </CardContent>
                                </Card>

                            </View>
                        </ScrollView>
                    </TabsContent>
                </Tabs>
            </View>
        </>
    )
}

export default Lessons;