import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

interface Badge {
  color: string;
  label: string;
}

interface BadgeGridProps {
  badges: Badge[];
}

const BadgeGrid = ({ badges }: BadgeGridProps) => {
  return (
    <View className="flex-wrap mt-4 flex-row justify-center">
      {badges.map((badge, index) => (
        <View
          key={index}
          className="m-2 h-28 w-28 bg-background rounded-full items-center justify-center"
          style={{ backgroundColor: badge.color }}
        >
          <Text className="text-white text-sm font-bold text-center">{badge.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default BadgeGrid; 