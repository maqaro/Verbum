import { ScrollView, View , RefreshControl} from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import Headerspace from "~/components/HeaderSpace";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import RankBadge from "~/components/RankBadge";
import { FIREBASE_DB } from "~/FirebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import LeaderboardEntry from "~/components/LeaderboardEntry";
import { useFocusEffect } from '@react-navigation/native';

interface Player {
    id: string;
    userName: string;
    points: number;
}

const Leaderboard = () => {
    const [tabValue, setTabValue] = React.useState('All');
    const [leaderboardData, setLeaderboardData] = React.useState<Player[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    
    const fetchLeaderboardData = async () => {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, "userInfo"));
        const data = querySnapshot.docs.map(doc => ({
            id:doc.id, 
            userName: doc.data().userName,
            points: doc.data().points,
        }));

        const sortedData =  data.sort((a, b) => b.points - a.points);
        setLeaderboardData(data);
        console.log(sortedData)
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchLeaderboardData().then(() => setRefreshing(false)); 
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchLeaderboardData();
        }, [])
    );

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
                        <TabsTrigger value="All" className="flex-1">
                            <Text>All</Text>
                        </TabsTrigger>
                        <TabsTrigger value="Friends" className="flex-1">
                            <Text>Friends</Text>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="All" className="w-full bg-background mb-24">
                        <ScrollView 
                            className="w-full bg-background"
                            showsVerticalScrollIndicator={false}
                        >
                            <RefreshControl
                                onRefresh={onRefresh} 
                                refreshing={refreshing}
                            />
                            <View className="flex-col w-full items-center">
                                {leaderboardData.map((player, index) => (
                                    <LeaderboardEntry
                                        key={player.id}
                                        rank={index + 1}
                                        userName={player.userName}
                                        points={player.points}
                                    />
                                ))}
                                
                            </View>
                        </ScrollView>
                    </TabsContent>
                    <TabsContent value="Friends" className="w-full bg-background mb-24">
                        <ScrollView 
                            className="w-full bg-background"
                            showsVerticalScrollIndicator={false}
                        >
                            <RefreshControl
                                onRefresh={onRefresh} 
                                refreshing={refreshing}
                            />
                            <View className="flex-col w-full items-center">
                                {/* friends to be implemented c*/}
                            </View>
                        </ScrollView>
                    </TabsContent>
                </Tabs>

            </View>
        </>
    )
}

export default Leaderboard;