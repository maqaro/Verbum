import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default () => {
    return (
    <Tabs>
        <Tabs.Screen 
            name="home" 
            options={{ 
                headerShown: false
            }}
        />
        <Tabs.Screen 
            name="search" 
            options={{ 
                headerShown: false
            }} 
        />
        <Tabs.Screen 
            name="lessons" 
            options={{ 
                headerShown: false
            }} 
        />
        <Tabs.Screen 
            name="leaderboard" 
            options={{ 
                headerShown: false
            }} 
        />
        <Tabs.Screen 
            name="profile" 
            options={{ 
                headerShown: false
            }} 
        />
    </Tabs>
    )
}