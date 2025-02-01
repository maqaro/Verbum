import { Stack } from 'expo-router';
import React, { useState } from 'react'
import { View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import Headerspace from '~/components/HeaderSpace';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Card, CardContent, CardFooter, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Search } from '~/lib/icons/Search'

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setSearchQuery('');
        setTimeout(() => setRefreshing(false), 500);
    }, []);

    return (
        <>
            <Stack.Screen options={{headerShown:false}}/>
            <Headerspace/>
            <View className='bg-background flex-1 items-center p-6'>
                <View id='searchbar' className='flex-row bg-secondary items-center space-x-2 rounded-3xl p-0'>
                    <Search className='text-muted-foreground w-5 h-5 ml-2'/>
                    <Input
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search"
                        className='flex-1 bg-transparent border-0 text-foreground'
                        placeholderTextColor="hsl(var(--muted-foreground))"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setSearchQuery('')}
                            className='p-2'
                        >
                            <Text className='text-muted-foreground'>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                <Text className='text-2xl font-bold text-primary self-start my-4'>
                    5 results
                </Text>
            
                <ScrollView className='w-full'>
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                    <View className='w-full space-y-4'>
                        <Card className='bg-card/50 hover:bg-card/80 flex-row items-center p-4 space-x-4 mb-4'>
                            <View className='flex-1 space-y-2'>
                                <CardTitle>
                                    <Text className='text-xl font-semibold text-foreground'>Profile Result</Text>
                                </CardTitle>
                                <CardContent className='p-0'>
                                    <Text className='text-muted-foreground'>Level 2</Text>
                                </CardContent>
                                <CardFooter className='p-0'>
                                    <Text className='text-primary'>View Profile → </Text>
                                </CardFooter>
                            </View>
                            <Avatar alt='avatar' className='w-20 h-20 border-2 border-primary'>
                                <AvatarFallback>
                                    <Text className='text-lg font-bold'>PF</Text>
                                </AvatarFallback>
                            </Avatar>
                        </Card>

                        <Card className='bg-card/50 hover:bg-card/80 flex-row items-center p-4 space-x-4 mb-4'>
                            <View className='flex-1 space-y-2'>
                                <CardTitle>
                                    <Text className='text-xl font-semibold text-foreground'>Quiz Result</Text>
                                </CardTitle>
                                <CardContent className='p-0'>
                                    <Text className='text-muted-foreground'>By Maqaro</Text>
                                </CardContent>
                                <CardFooter className='p-0'>
                                    <Text className='text-primary'>View Quiz → </Text>
                                </CardFooter>
                            </View>
                            <Avatar alt='avatar' className='w-20 h-20 border-2 border-primary'>
                                <AvatarFallback>
                                    <Text className='text-lg font-bold'>PF</Text>
                                </AvatarFallback>
                            </Avatar>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

export default SearchPage;