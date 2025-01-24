import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
    <Stack>
        <Stack.Screen 
            name="index" 
            options={{ 
                headerTitle: 'Lesson',
                headerShown: true
            }}
        />
    </Stack>
    )
}