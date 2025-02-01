import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

interface RankBadgeProps {
    rank: number;
}

const RankBadge = ({ rank }: RankBadgeProps) => {
    if (rank > 3) return null;
    
    const badges: { [key: number]: { color: string; text: string } } = {
        1: { color: "bg-yellow-500/20", text: "🥇" },
        2: { color: "bg-gray-300/20", text: "🥈" },
        3: { color: "bg-orange-700/20", text: "🥉" },
    };

    return (
        <View className={`${badges[rank].color} w-12 h-12 rounded-full items-center justify-center`}>
            <Text className="text-2xl">{badges[rank].text}</Text>
        </View>
    );
};

export default RankBadge;