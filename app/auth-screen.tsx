import React from "react";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View, Keyboard } from "react-native";
import { Text } from "@/components/ui/text";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { router, Stack } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";
import { ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function authScreen() {
    const [tabValue, setTabValue] = React.useState('login');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            router.push('/tabs/home');
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            if (response.user) {
                createUserDetails()
            }
        } catch (error: any) {
            console.error(error);
            alert('Sign In' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const createUserDetails = () => {
        const DEFAULT_USERNAME = "NewUser"

        setDoc(doc(FIREBASE_DB, "userInfo", email), {
            missionsCompleted: 0,
            points: 0,
            userName: DEFAULT_USERNAME
        })
    }

    return (
    <>
        <Stack.Screen options={{headerShown:false}} />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='bg-background flex-1 justify-center p-6'>
                    <Tabs
                    value={tabValue}
                    onValueChange={setTabValue}
                    className='w-full max-w-[400px] mx-auto flex-col gap-1.5'
                    >
                        <TabsList className='flex-row w-full'>
                            <TabsTrigger value='login' className='flex-1' onPress={() => { setPassword(''); setEmail(''); }}>
                                <Text>Log In</Text>
                            </TabsTrigger>
                            <TabsTrigger value='register' className='flex-1' onPress={() => { setPassword(''); setEmail(''); }}>
                                <Text>Register</Text>
                            </TabsTrigger>
                        </TabsList>
                            <TabsContent value='login'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign In</CardTitle>
                                        <CardDescription>
                                            Sign in to your account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='gap-4 native:gap-2'>
                                        <View className='gap-1'>
                                            <Label nativeID='email-login'>Email</Label>
                                            <Input value={email} autoCapitalize="none" onChangeText={(text) => setEmail(text)}/>
                                        </View>
                                        <View className='gap-1'>
                                            <Label nativeID='password-login'>Password</Label>
                                            <Input secureTextEntry={true} value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} />
                                        </View>
                                    </CardContent>
                                    <CardFooter className="justify-center">
                                        <Button 
                                            className="bg-secondary" 
                                            disabled={loading}
                                            onPress={() => {
                                                setLoading(true);
                                                signIn();
                                                setEmail('');
                                                setPassword('');
                                                setTimeout(() => setLoading(false), 2000);
                                            }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="hsl(var(--primary))" />
                                            ) : (
                                                <Text className="text-primary">Sign In</Text>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value='register'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sign Up</CardTitle>
                                        <CardDescription>
                                            Create a new account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className='gap-4 native:gap-2'>
                                        <View className='gap-1'>
                                            <Label nativeID='email-register'>Email</Label>
                                            <Input value={email} autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                                        </View>
                                        <View className='gap-1'>
                                            <Label nativeID='password-register'>Password</Label>
                                            <Input secureTextEntry={true} value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)}/>
                                        </View>
                                    </CardContent>
                                    <CardFooter className="justify-center">
                                        <Button 
                                            className="bg-secondary" 
                                            disabled={loading}
                                            onPress={() => {
                                                setLoading(true);
                                                signUp();
                                                setTimeout(() => setLoading(false), 2000);
                                            }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="hsl(var(--primary))" />
                                            ) : (
                                                <Text className="text-primary">Sign Up</Text>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        
                    </Tabs>
                </View>
            </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
    );
}