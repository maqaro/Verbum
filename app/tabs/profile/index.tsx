import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Settings, UserPen, Star, Globe, LandPlot } from "~/lib/icons";
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

const Profile = () => {
    const user = FIREBASE_AUTH.currentUser
    const [tabValue, setTabValue] = useState('badges');
    const [points, setPoints] = useState(0);
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [userRank, setUserRank] = useState<number | null>(null);

    const getUserInfo = async () => {
        if (user?.email) {
            const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email));
            const data = userDoc.data()
            setPoints(data?.points || 0);
            setAvatar(data?.avatar.uri || undefined);
            setUserName(data?.details.userName)
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
                        <AvatarImage source={{uri: avatar}}/>
                        <AvatarFallback>
                            <Text className="text-4xl font-bold text-foreground">{userName.substring(0,2)}</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Card className='bg-card w-full m-4 p-6 items-center'>
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
                                <Text className='text-xl font-bold'>{userRank !== null ? `#${userRank}` : 'N/A'}</Text>
                            </View>
                        </View>
                    </Card>
                    <Tabs
                    value={tabValue}
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
                            {/* to be finished */}
                        </TabsContent>
                        <TabsContent value='stats'>
                            {/* to be finished */}
                        </TabsContent>
                        <TabsContent value='friends'>
                            {/* to be finished */}
                        </TabsContent>
                    </Tabs>
                </Card>
            </View>
        </>
    )
}

export default Profile;