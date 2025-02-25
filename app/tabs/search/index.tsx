import { Stack } from 'expo-router';
import React, { useState, useCallback } from 'react'
import { View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import Headerspace from '~/components/HeaderSpace';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Search } from '~/lib/icons'
import { FIREBASE_DB, FIREBASE_AUTH } from '~/FirebaseConfig';
import { collection, getDocs, query, where, or, getDoc, doc, updateDoc } from 'firebase/firestore';
import SearchResultCard from '~/components/SearchCardResults';

interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    avatar?: string;
}

const SearchPage = () => {
    const user = FIREBASE_AUTH.currentUser;

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const performSearch = async (searchText: string) => {
        if (!searchText.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const usersQuery = searchText.toLowerCase();
            
            const usersSnapshot = await getDocs(
                query(collection(FIREBASE_DB, "userInfo"),
                where('details.userNameLower', '>=', usersQuery),
                where('details.userNameLower', '<=', usersQuery + '\uf8ff'))
            );

            const userResults: SearchResult[] = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                type: "Add Friend",
                title: doc.data().details.userName || '',
                subtitle: `Points: ${doc.data().points}`,
                avatar: doc.data().avatar?.uri
            }));

            setResults([...userResults]);

            // TODO: Implement quiz search when quiz collection is available
            const quizResults: SearchResult[] = [
                // {
                //     id: 'quiz1',
                //     type: 'quiz',
                //     title: 'Basic Vocabulary',
                //     subtitle: 'By Maqaro',
                // }
            ];

            setResults([...userResults, ...quizResults]);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSearchQuery('');
        setResults([]);
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    const addUser = async () => {
        if (!user?.email) return;

        const userDoc = await getDoc(doc(FIREBASE_DB, "userInfo", user.email))
        if (!userDoc.exists()){
            return;
        } else{
            const friendsList = userDoc.data().friends || []
            const cardEmail = results.find(r => r.id)?.id;

            if (!cardEmail) return;

            if (friendsList.includes(cardEmail)){
                setResults(results.map(result => 
                    result.id === cardEmail 
                        ? { ...result, type: 'Already friends!' }
                        : result
                ));
                return;
            } else if (!friendsList.includes(cardEmail)){
                setResults(results.map(result => 
                    result.id === cardEmail 
                        ? { ...result, type: 'Friend added!' }
                        : result
                ));
                await updateDoc(doc(FIREBASE_DB, "userInfo", user.email), {
                    friends: [...friendsList, cardEmail]
                });
            }
        }
    }

    const copyQuiz = () => {
        //TODO
        console.log("TODO: copied quiz")
    }

    return (
        <>
            <Stack.Screen options={{headerShown:false}}/>
            <Headerspace/>
            <View className='bg-background flex-1 items-center p-6'>
                <View id='searchbar' className='flex-row bg-secondary items-center space-x-2 rounded-3xl pl-2'>
                    <Search className='text-muted-foreground w-5 h-5 ml-2'/>
                    <Input
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            performSearch(text);
                        }}
                        placeholder="Search users and quizzes"
                        className='flex-1 bg-transparent border-0 text-foreground'
                        placeholderTextColor="hsl(var(--muted-foreground))"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => {
                                setSearchQuery('');
                                setResults([]);
                            }}
                            className='p-2'
                        >
                            <Text className='text-muted-foreground pr-2'>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                {results.length > 0 && (
                    <Text className='text-2xl font-bold text-primary self-start my-4'>
                        {results.length} results
                    </Text>
                )}
            
                <ScrollView className='w-full'>
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                    <View className='w-full space-y-4'>
                        {results.map((result) => (
                            <SearchResultCard
                                key={result.id}
                                id={result.id}
                                type={result.type}
                                title={result.title}
                                subtitle={result.subtitle}
                                avatar={result.avatar}
                                onPress={() => {
                                    result.type === "Add Friend" ? addUser() : copyQuiz()
                                }}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

export default SearchPage;