import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Settings, UserPen, Star, Globe, LandPlot } from "~/lib/icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { router, Stack } from "expo-router";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import Headerspace from '~/components/HeaderSpace'
import { FIREBASE_AUTH } from "~/FirebaseConfig";

const Profile = () => {
    const [tabValue, setTabValue] = React.useState('badges');
    return (
        <>
            <Stack.Screen options={{headerShown:false}} />
            <Headerspace/>
            <View id="profileHeader" className="bg-background flex-row items-center justify-between p-4">
                <TouchableOpacity className="bg-secondary p-2 rounded-full" onPress={() => router.push('/tabs/profile/settings')}>
                    <Settings className="color-primary"/>
                </TouchableOpacity>
                <Text className="text-4xl font-semibold text-foreground">Profile</Text>
                <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
                    <UserPen className="color-primary"/>
                </TouchableOpacity>
            </View>
            <View className='bg-background flex-1 items-center p-4'>
                <Card className="bg-background flex-1 items-center m-4">
                    <Avatar alt="avatar" className="w-32 h-32 m-6">
                        <AvatarFallback>
                            <Text className="text-4xl font-bold text-foreground">PF</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Card className='bg-card w-full m-4 p-4 items-center'>
                        <View className='flex-row justify-around w-full'>
                            <View className='items-center'>
                                <Star className='color-primary'/>
                                <Text className='text-primary font-bold'>Points</Text>
                                <Text className='text-xl font-bold'>590</Text>
                            </View>
                            <Separator orientation='vertical'/>
                            <View className='items-center'>
                                <Globe className='color-primary'/>
                                <Text className='text-primary font-bold'>World Rank</Text>
                                <Text className='text-xl font-bold'>#1,438</Text>
                            </View>
                            <Separator orientation='vertical'/>
                            <View className='items-center'>
                                <LandPlot className='color-primary'/>
                                <Text className='text-primary font-bold'>Local Rank</Text>
                                <Text className='text-xl font-bold'>#56</Text>
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