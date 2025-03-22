import { Stack } from 'expo-router';
import React, { useState, useCallback } from 'react'
import { View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import Headerspace from '~/components/HeaderSpace';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Search } from '~/lib/icons'
import { FIREBASE_DB, FIREBASE_AUTH } from '~/FirebaseConfig';
import { collection, getDocs, query, where, getDoc, doc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import SearchResultCard from '~/components/SearchCardResults';

interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    avatar?: string;
    languageCode?: string;
}

interface Quiz {
    id: string;
    name: string;
    originalId?: string;
    languageCode: string;
}

interface UserData {
    quizzes?: {
        savedQuizzes?: Quiz[]; 
        userQuizzes?: string[];
    };
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

            const quizzesSnapshot = await getDocs(
                query(collection(FIREBASE_DB, "quizzes"),
                where('info.isOriginal', '==', true),
                where('info.nameLower', '>=', usersQuery),
                where('info.nameLower', '<=', usersQuery + '\uf8ff'))
            );

            const userResults: SearchResult[] = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                type: "Add Friend",
                title: doc.data().details.userName || '',
                subtitle: `Points: ${doc.data().points}`,
                avatar: doc.data().avatar?.uri
            }));

            const quizResults: SearchResult[] = quizzesSnapshot.docs.map(doc => ({
                id: doc.id,
                type: "Save Quiz",
                title: doc.data().info.name || '',
                subtitle: `Owner: ${doc.data().info.owner}`,
                avatar: "",
                languageCode: doc.data().info.languageCode,
            }));

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
            } else if (user.email == cardEmail){
                setResults(results.map(result => 
                    result.id === cardEmail 
                        ? { ...result, type: 'You can not friend yourself!' }
                        : result
                ));
                return;
            }else if (!friendsList.includes(cardEmail)){
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

    const copyQuiz = async (): Promise<void> => {
        if (!user?.email) return;
    
        const userDocRef = doc(FIREBASE_DB, "userInfo", user.email);
        const userDoc = await getDoc(userDocRef);
    
        if (!userDoc.exists()) return;
    
        const userData = userDoc.data() as UserData;
        const savedQuizzes = userData?.quizzes?.savedQuizzes || [];
        const userQuizzes = userData?.quizzes?.userQuizzes || [];
    
        // Find selected quiz details
        const quizId = results.find(r => r.type === "Save Quiz")?.id;
        const quizName = results.find(r => r.type === "Save Quiz")?.title;
        const languageCode = results.find(r => r.type ==="Save Quiz")?.languageCode;
    
        if (!quizId || !quizName) return;
    
        // Check if the quiz is already saved using originalId
        if (savedQuizzes.some((quiz: Quiz) => quiz.originalId === quizId)) {
            setResults(
                results.map(result =>
                    result.id === quizId ? { ...result, type: "Already saved!" } : result
                )
            );
            return;
        } else if (userQuizzes.includes(quizId)) {
            setResults(
                results.map(result =>
                    result.id === quizId ? { ...result, type: "This is your Quiz!" } : result
                )
            );
            return;
        }
    
        // Create a copy & get the new quiz ID
        const newQuizId = await makeCopy(quizId);
        if (!newQuizId) return;
    
        // Store with originalId field
        await updateDoc(userDocRef, {
            "quizzes.savedQuizzes": arrayUnion({ id: newQuizId, originalId: quizId, name: quizName, languageCode: languageCode }),
        });
    
        // Update UI without including saved quizzes
        setResults(
            results
                .filter(result => result.type !== "Already saved!") // Remove duplicate messages
                .map(result =>
                    result.id === quizId ? { ...result, type: "Quiz saved!" } : result
                )
        );
    };
    
    const makeCopy = async (originalQuizId: string): Promise<string | null> => {
        try {
            const quizDocRef = doc(FIREBASE_DB, "quizzes", originalQuizId);
            const quizDoc = await getDoc(quizDocRef);
    
            if (!quizDoc.exists()) {
                console.error("Quiz not found");
                return null;
            }
    
            const quizData = quizDoc.data();
            if (!quizData) return null;
    
            const newQuizData = {
                ...quizData,
                info: {
                    ...quizData.info,
                    owner: user?.email ?? "",
                    timesPlayed: 0,
                    isOriginal: false
                },
            };
    
            const newQuizRef = doc(collection(FIREBASE_DB, "quizzes"));
            await setDoc(newQuizRef, newQuizData);
            return newQuizRef.id;
        } catch (error) {
            console.error("Error copying quiz:", error);
            return null;
        }
    };
    

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
                                languageCode={result.languageCode}
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
