import { View } from "react-native";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";
import { Avatar, AvatarFallback } from "./ui/avatar";
import RankBadge from "./RankBadge";

type LeaderboardEntryProps = {
    rank: number;
    userName: string;
    points: number;
}

const LeaderboardEntry = ({
    rank,
    userName,
    points,
}: LeaderboardEntryProps) => (
    <Card className="bg-card w-full m-4">
        <CardContent className="flex-row items-center justify-between pb-0 p-4">
            <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center">
                    <Text className="text-primary text-2xl font-bold" id="rank">{ rank }</Text>
                </View>
                <View className="mx-4">
                    <Avatar alt="avatar" className="w-24 h-24"> 
                        <AvatarFallback>
                            <Text className="text-4xl font-bold text-primary">{userName.slice(0, 2) }</Text>
                        </AvatarFallback>
                    </Avatar>
                </View>
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-primary">{ userName }</Text>
                    <Text className="text-primary/50 font-bold">Points: { points }</Text>
                </View>
            </View>
            <RankBadge rank={ rank } />
        </CardContent>
    </Card>
)

export default LeaderboardEntry