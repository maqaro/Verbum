import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { House, Search, LibraryBig, Trophy, User } from '~/lib/icons';
import { useColorScheme } from 'react-native';

export default () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
                borderTopColor: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
                height: 60,
            },
            tabBarActiveTintColor: 'hsl(270 100% 59%)',
            tabBarInactiveTintColor: isDark ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)', 
        }}>
            <Tabs.Screen 
                name="home" 
                options={{ 
                    tabBarIcon: ({ color, size }) => (
                        <House color={color} size={size} />
                    ),
                    tabBarLabel: 'Home'
                }}
            />
        <Tabs.Screen 
            name="search"
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <Search color={color} size={size} />
                ),
                tabBarLabel: 'Search'
            }}
        />
        <Tabs.Screen 
            name="lessons" 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <LibraryBig color={color} size={size} />
                ),
                tabBarLabel: 'Lessons'
            }}
        />
        <Tabs.Screen 
            name="leaderboard" 
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <Trophy color={color} size={size} />
                ),
                tabBarLabel: 'Leaderboard'
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{ 
                tabBarIcon: ({ color, size }) => (
                    <User color={color} size={size} />
                ),
                tabBarLabel: 'Profile'
            }}
        />
    </Tabs>
    )
}