import { Stack } from 'expo-router';

export default function StackLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{ 
                    headerTitle: 'Lesson',
                    headerShown: true
                }}
            />
            <Stack.Screen 
                name="quiz" 
                options={{
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
             <Stack.Screen 
                name="scan" 
                options={{
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
        </Stack>
    )
}