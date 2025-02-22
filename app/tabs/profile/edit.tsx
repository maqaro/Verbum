import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Text } from '~/components/ui/text'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import Headerspace from "~/components/HeaderSpace"
import { Stack, useRouter } from "expo-router"
import { Camera, ChevronLeft } from '~/lib/icons'
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig"

const Edit = () => {
    const router = useRouter()
    const user = FIREBASE_AUTH.currentUser
    
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(user?.displayName || '')

    return (
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <Headerspace />
            <View className="bg-background flex-row items-center justify-between p-4">
                <TouchableOpacity 
                    className="bg-secondary p-2 rounded-full" 
                    onPress={() => router.back()}
                >
                    <ChevronLeft className="color-primary"/>
                </TouchableOpacity>
                <Text className="text-4xl font-semibold text-foreground">Edit Profile</Text>
                <View className="w-10"/>
            </View>
            <ScrollView className="flex-1 bg-background p-4">
                <Card className="bg-card">
                    <CardHeader>
                        <View className="items-center">
                            <View>
                                <Avatar alt="avatar" className="w-32 h-32">
                                    <AvatarFallback>
                                        <Text className="text-4xl font-bold">
                                            {username.substring(0, 2).toUpperCase()}
                                        </Text>
                                    </AvatarFallback>
                                </Avatar>
                                <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
                                    <Camera size={24} className="text-secondary" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity 
                                onPress={() => {
                                    // TODO: Implement image picker
                                    Alert.alert('Coming soon', 'Image upload will be available soon')
                                }}
                            >
                                <Text className="text-primary mt-2 font-semibold">
                                    Change Profile Picture
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </CardHeader>
                    <CardContent className="gap-4">
                        <View>
                            <Text className="text-foreground font-medium mb-2">Username</Text>
                            <Input 
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Enter username"
                                className="bg-background"
                            />
                        </View>


                        <Button 
                            className="mt-4 bg-secondary"
                            // onPress={}
                            disabled={loading}
                        >
                            <Text className="text-primary font-bold">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </Button>
                    </CardContent>
                </Card>
            </ScrollView>
        </>
    )
}

export default Edit