import { ScrollView, View , RefreshControl} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Headerspace from "~/components/HeaderSpace";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import RankBadge from "~/components/RankBadge";

const Leaderboard = () => {
    const [tabValue, setTabValue] = React.useState('weekly');
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
                <Text className="text-4xl font-semibold text-foreground">Leaderboard</Text>
            </View>
            <View className='bg-background flex-1 items-center p-6'>
                <Tabs
                    value={tabValue}
                    onValueChange={setTabValue}
                    className="w-full"
                >
                    <TabsList className="flex-row justify-center w-full">
                        <TabsTrigger value="weekly" className="flex-1">
                            <Text>Weekly</Text>
                        </TabsTrigger>
                        <TabsTrigger value="alltime" className="flex-1">
                            <Text>All Time</Text>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="weekly">
                        <ScrollView >
                            <RefreshControl
                                onRefresh={onRefresh} 
                                refreshing={refreshing}
                            />
                            <View className="flex-col w-full items-center">
                                <Card className="bg-card/90 w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">1</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={1} />
                                    </CardContent>
                                </Card>

                                <Card className="bg-card w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">2</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={2} />
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/90 w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">3</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={3} />
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/90 w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">4</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={4}/>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/90 w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">5</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={5}/>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/90 w-full m-4">
                                    <CardContent className="flex-row items-center justify-between pb-0 p-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                                                <Text className="text-primary text-2xl font-bold" id="rank">6</Text>
                                            </View>
                                            
                                            <View className="mx-4">
                                                <Avatar alt="avatar" className="w-24 h-24"> 
                                                    <AvatarFallback>
                                                        <Text className="text-4xl font-bold text-primary">PF</Text>
                                                    </AvatarFallback>
                                                </Avatar>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-2xl font-bold text-primary">Player Name</Text>
                                                <Text className="text-primary/50 font-bold">Points: 590</Text>
                                            </View>
                                        </View>
                                        <RankBadge rank={6}/>
                                    </CardContent>
                                </Card>
                            </View>
                        </ScrollView>
                    </TabsContent>
                    <TabsContent value="alltime">
                        <Text>All Time</Text>
                    </TabsContent>
                </Tabs>

            </View>
        </>
    )
}

export default Leaderboard;