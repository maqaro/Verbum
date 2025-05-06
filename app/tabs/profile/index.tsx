import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Settings, UserPen, Star, Globe, Flame } from "~/lib/icons";
import { Text } from "~/components/ui/text";
import { router, Stack } from "expo-router";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import Headerspace from '~/components/HeaderSpace'
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import BadgeGrid from "~/components/BadgeGrid";

const Profile = () => {
    const user = FIREBASE_AUTH.currentUser
    const [tabValue, setTabValue] = useState('badges');
    const [points, setPoints] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [streak, setStreak] = useState(0);
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [friends, setFriends] = useState<string[]>([]);
    
    const getUserInfo = async () => {
        if (user?.email) {
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email));
            const data = userDoc.data()
            setPoints(data?.points || 0);
            setStreak(data?.streakInfo.currentStreak)
            setHighestStreak(data?.streakInfo.highestStreak)
            setAvatar(data?.avatar.uri || undefined);
            setUserName(data?.details.userName)
            setFriends(data?.friends)
        }
    }

    const getUserRank = async () => {
        const sortedUsers = await fetchAndSortUsers();
        
        const userRank = sortedUsers.findIndex(u => u.id === user?.email) + 1;
        
        return userRank > 0 ? userRank : null;
    };

    useFocusEffect(
        React.useCallback(() => {
            getUserInfo().then(() => {
                getUserRank().then(rank => {
                    setUserRank(rank);
                });
            });
        }, [])
    );

    const fetchAndSortUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(FIREBASE_DB, "userInfo"));

            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                userName: doc.data().details.userName,
                points: doc.data().points,
                avatar: doc.data().avatar.uri,
            }));

            const sortedUsers = users.sort((a, b) => b.points - a.points);

            return sortedUsers; 
        } catch (error) {
            console.error("Error fetching users: ", error);
            return [];
        }
    };

    const generateBadges = () => {
        const badges = [];

        if (points > 1000) {
            badges.push({ color: '#FFD700', label: 'Gold' });
        } else if (points > 500) {
            badges.push({ color: '#C0C0C0', label: 'Silver' });
        } else if (points > 100) {
            badges.push({ color: '#CD7F32', label: 'Bronze' });
        }

        if (points > 0) {
            badges.push({ color: '#D708F5', label: 'First Points' });
        }

        if (highestStreak >= 10) {
            badges.push({ color: '#FF0000', label: 'On Fire' });
        } 
        if (highestStreak >= 5) {
            badges.push({ color: '#FF3000', label: 'Heating Up' });
        } 
        if (highestStreak >= 1) {
            badges.push({ color: '#FF6000', label: 'Getting Started' });
        }
        if (friends.length >= 1) {
            badges.push({ color: '#8389bc', label: 'First Friend' });
        } 
        if (friends.length >= 5) {
            badges.push({ color: '#b46051', label: 'Getting Social' });
        }
        if (friends.length >= 10) {
            badges.push({ color: '#1a263d', label: 'Social Butterfly' });
        }

        if (userRank && userRank <= 100) {
            badges.push({ color: '#4B0082', label: 'Top 100' });
        }
        if (userRank && userRank <= 10) {
            badges.push({ color: '#0b9d29', label: 'Top 10' });
        }
        if (userRank && userRank <= 3) {
            badges.push({ color: '#CD7F32', label: 'Top 3' });
        }
        if (userRank && userRank <= 1) {
            badges.push({ color: '#FFD700', label: 'Number 1' });
        }

        return badges;
    };

    return (
        <>
            <Stack.Screen options={{headerShown:false}} />
            <Headerspace/>
            <View id="profileHeader" className="bg-background flex-row items-center justify-between p-4">
                <TouchableOpacity className="bg-secondary p-2 rounded-full" onPress={() => router.push('/tabs/profile/settings')}>
                    <Settings className="color-primary"/>
                </TouchableOpacity>
                <Text className="text-4xl font-semibold text-foreground">Profile</Text>
                <TouchableOpacity className='bg-secondary p-2 rounded-full' onPress={() =>router.push('/tabs/profile/edit')}>
                    <UserPen className="color-primary"/>
                </TouchableOpacity>
            </View>
            <View className='bg-background flex-1 items-center p-4'>
                <Card className="bg-background flex-1 items-center m-4">
                    <Avatar alt="avatar" className="w-32 h-32 m-6">
                        <AvatarImage source={{ uri: avatar }}/>
                        <AvatarFallback>
                            <Text className="text-4xl font-bold text-foreground">{ userName.substring(0,2) }</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Card className='bg-card w-full m-4 p-4 items-center'>
                        <View className='flex-row justify-center'>
                            <View className='flex-1 items-center'>
                                <Star className='color-primary'/>
                                <Text className='text-primary font-bold'>Points</Text>
                                <Text className='text-xl font-bold'>{ points }</Text>
                            </View>
                            <Separator orientation='vertical'/>
                            <View className='flex-1 items-center'>
                                <Globe className='color-primary'/>
                                <Text className='text-primary font-bold'>Rank</Text>
                                <Text className='text-xl font-bold'>{ userRank !== null ? `#${userRank}` : 'N/A' }</Text>
                            </View>
                            <Separator orientation='vertical'/>
                            <View className='flex-1 items-center'>
                                <Flame className='color-primary'/>
                                <Text className='text-primary font-bold'>Streak</Text>
                                <Text className='text-xl font-bold'>{ streak }</Text>
                            </View>
                        </View>
                    </Card>
                    <Tabs
                    value={ tabValue }
                    onValueChange={setTabValue}
                    className='bg-backgorund p-2'
                    >
                        <TabsList className='flex-row w-full'>
                            <TabsTrigger value='badges' className='flex-1'>
                                <Text>Badges</Text>
                            </TabsTrigger>
                            <TabsTrigger value='stats' className='flex-1'>
                                <Text>Stats</Text>
                            </TabsTrigger>
                            <TabsTrigger value='friends' className='flex-1'>
                                <Text>Friends</Text>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='badges'>
                            <BadgeGrid badges={generateBadges()} />
                        </TabsContent>
                        <TabsContent value='stats'>
                            { /* to be finished */ }
                        </TabsContent>
                        <TabsContent value='friends'>
                            { /* to be finished */ }
                        </TabsContent>
                    </Tabs>
                </Card>
            </View>
        </>
    )
}

export default Profile;