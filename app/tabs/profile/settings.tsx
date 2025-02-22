import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Headerspace from "~/components/HeaderSpace";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { FIREBASE_AUTH } from "~/FirebaseConfig";
import { useState, useEffect } from "react";
import SettingItem from "~/components/SettingsItem";
import { useColorScheme } from '~/lib/useColorScheme';

const Settings = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const { colorScheme, setColorScheme } = useColorScheme();
    const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

    const ToggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        setColorScheme(newMode ? 'dark' : 'light');
    };

    useEffect(() => {
        setDarkMode(colorScheme === 'dark');
    }, [colorScheme]);
    
    return (
        <>
            <Stack.Screen options={{headerShown: false}} /> 
            <Headerspace />
            <View className="bg-background flex-row items-center justify-between p-4">
                <TouchableOpacity 
                    className="bg-secondary p-2 rounded-full" 
                    onPress={() => router.back()}
                >
                    <ChevronLeft className="color-primary"/>
                </TouchableOpacity>
                <Text className="text-4xl font-semibold text-foreground">Settings</Text>
                <View className="w-10"/>
            </View>
            
            <ScrollView className="flex-1 bg-background">
                <View className="p-4">
                    <Card className="p-4">
                        <Text className="text-sm font-medium text-muted-foreground mb-2">
                            Preferences
                        </Text>
                        <SettingItem
                            title="Notifications"
                            description="Receive push notifications"
                            hasSwitch
                            switchValue={notifications}
                            onSwitchChange={setNotifications}
                        />
                        <Separator />
                        <SettingItem
                            title="Dark Mode"
                            description="Toggle dark mode"
                            hasSwitch
                            switchValue={darkMode}
                            onSwitchChange={ToggleDarkMode}
                        />
                    </Card>

                    <Card className="p-4 mt-4">
                        <Text className="text-sm font-medium text-muted-foreground mb-2">
                            Account
                        </Text>
                        <SettingItem
                            title="Email"
                            description={FIREBASE_AUTH.currentUser?.email || "No email set"}
                        />
                        <Separator />
                        <Separator />
                        <SettingItem
                            title="Sign Out"
                            onPress={() => FIREBASE_AUTH.signOut()}
                        />
                    </Card>

                    <Card className="p-4 mt-4">
                        <Text className="text-sm font-medium text-muted-foreground mb-2">
                            About
                        </Text>
                        <SettingItem
                            title="Version"
                            description="1.0.0"
                        />
                        <Separator />
                        <SettingItem
                            title="Terms of Service"
                            onPress={() => {/* Add Terms navigation */}}
                        />
                        <Separator />
                        <SettingItem
                            title="Privacy Policy"
                            onPress={() => {/* Add Privacy navigation */}}
                        />
                    </Card>
                </View>
            </ScrollView>
        </>
    );
}


export default Settings;