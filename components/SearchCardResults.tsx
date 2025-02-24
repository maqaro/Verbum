import { View, TouchableOpacity } from "react-native";
import { Text } from "./ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

interface SearchResultCardProps {
    id: string;
    type: 'profile' | 'quiz';
    title: string;
    subtitle: string;
    avatar?: string;
    onPress?: () => void;
}

const SearchResultCard = ({
    id,
    type,
    title,
    subtitle,
    avatar,
    onPress
}: SearchResultCardProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Card 
                key={id}
                className='bg-card/50 hover:bg-card/80 flex-row items-center p-4 space-x-4 mb-4'
            >
                <View className='flex-1 space-y-2'>
                    <CardTitle>
                        <Text className='text-3xl font-semibold text-foreground'>
                            {title}
                        </Text>
                    </CardTitle>
                    <CardContent className='p-0'>
                        <Text className='text-xl font-semibold text-muted-foreground/70'>{subtitle}</Text>
                    </CardContent>
                    <CardFooter className='p-0'>
                        <Text className='text-primary'>
                            View {type === 'profile' ? 'Profile' : 'Quiz'} → 
                        </Text>
                    </CardFooter>
                </View>
                <Avatar alt='avatar' className='w-24 h-24'>
                    {avatar ? (
                        <AvatarImage source={{ uri: avatar }} />
                    ) : (
                        <AvatarFallback>
                            <Text className='text-lg font-bold'>
                                {title.substring(0, 2).toUpperCase()}
                            </Text>
                        </AvatarFallback>
                    )}
                </Avatar>
            </Card>
        </TouchableOpacity>
    );
};

export default SearchResultCard;