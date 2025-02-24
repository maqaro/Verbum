import { ScrollView, View , RefreshControl} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import Headerspace from "~/components/HeaderSpace";
import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import LeaderboardEntry from "~/components/LeaderboardEntry";
import { useFocusEffect } from '@react-navigation/native';

interface Player {
    id: string;
    userName: string;
    points: number;
    avatar: string | undefined;
}

const Leaderboard = () => {
    const user = FIREBASE_AUTH.currentUser
    const [tabValue, setTabValue] = useState('All');
    const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [friendsList, setFriendsList] = useState<string[]>([]);
    
    const fetchLeaderboardData = async () => {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, "userInfo"));
        const data = querySnapshot.docs.map(doc => ({
            id:doc.id, 
            userName: doc.data().details.userName,
            points: doc.data().points,
            avatar: doc.data().avatar.uri,
        }));

        const sortedData =  data.sort((a, b) => b.points - a.points);
        setLeaderboardData(sortedData);
    }

    const fetchFriendsList = async () => {
        if (user?.email){
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email))
            if (userDoc.exists()){
                const data = userDoc.data()
                setFriendsList(data.friends || [])
            }
        }
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

    useFocusEffect(
        React.useCallback(() => {
            fetchFriendsList();
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
                                        avatar={player.avatar}
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
                                {leaderboardData
                                .filter(player => friendsList.includes(player.id))
                                .map((player, index) => (
                                    <LeaderboardEntry
                                        key={player.id}
                                        rank={index + 1}
                                        userName={player.userName}
                                        points={player.points}
                                        avatar={player.avatar}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </TabsContent>
                </Tabs>

            </View>
        </>
    )
}

export default Leaderboard;