import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
    <Stack>
        <Stack.Screen 
            name="index" 
            options={{ 
                headerTitle: 'Profile',
                headerShown: false
            }}
        />
        <Stack.Screen 
            name="settings" 
            options={{ 
                headerTitle: 'Settings',
                headerShown: false
            }}
        />
    </Stack>
    )
}