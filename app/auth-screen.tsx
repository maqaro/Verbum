import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stack } from "expo-router";

export default function authScreen() {
    const [tabValue, setTabValue] = React.useState('login');
    return (
    <>
        <Stack.Screen options={{headerShown:false}} />
        <View className='bg-background flex-1 justify-center p-6'>
            <Tabs
            value={tabValue}
            onValueChange={setTabValue}
            className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
            >
                <TabsList className='flex-row w-full'>
                    <TabsTrigger value='login' className='flex-1'>
                        <Text>Log In</Text>
                    </TabsTrigger>
                    <TabsTrigger value='register' className='flex-1'>
                        <Text>Register</Text>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='login'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Log In</CardTitle>
                            <CardDescription>
                                Log in to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='gap-4 native:gap-2'>
                            <View className='gap-1'>
                                <Label nativeID='username-login'>Username</Label>
                                <Input aria-aria-labelledby='username-login' />
                            </View>
                            <View className='gap-1'>
                                <Label nativeID='password-login'>Password</Label>
                                <Input id='password-login'/>
                            </View>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button className="bg-secondary">
                                <Text className="text-primary">Log In</Text>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value='register'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='gap-4 native:gap-2'>
                            <View className='gap-1'>
                                <Label nativeID='username-register'>Username</Label>
                                <Input aria-labelledby='ur' secureTextEntry />
                            </View>
                            <View className='gap-1'>
                                <Label nativeID='password-register'>Password</Label>
                                <Input aria-labelledby='pr' secureTextEntry />
                            </View>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <Button className="bg-secondary">
                                <Text className="text-primary">Create Account</Text>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
      </View>
    </>
    )
}