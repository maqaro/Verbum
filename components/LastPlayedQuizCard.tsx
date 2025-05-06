// Update the LastPlayedQuizCard component to match the desired layout and styling
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useRouter } from "expo-router";
import FlagAvatar from "./FlagAvatar";

interface LastPlayedQuizCardProps {
  quizId: string;
  quizTitle: string;
  languageCode: string;
}

const LANGUAGE_FLAGS = [
    { value: "AR", path: "../images/flags/SA" },
    { value: "ES", path: "../images/flags/ES" },
    { value: "FR", path: "../images/flags/FR" },
];

const LastPlayedQuizCard = ({ quizId, quizTitle, languageCode }: LastPlayedQuizCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`tabs/lessons/${quizId}` as any);
  };

  return (
    <View className="flex-col mt-4">
        <Text className="text-2xl font-semibold text-primary mb-2">Continue your last lesson</Text>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} className="flex-row items-center">
            <Avatar alt="Quiz Picture" className="w-16 h-16 mr-4">
                <FlagAvatar languageCode={languageCode}/>
                <AvatarFallback>
                    <Text className="text-4xl text-primary font-bold">Q</Text>
                </AvatarFallback>
            </Avatar>
            <View className="flex-col ml-4">
            <Text className="text-2xl font-semibold text-primary">{quizTitle}</Text>
            <Text className="text-lg font-semibold text-primary/60 underline">Test your knowledge → </Text>
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default LastPlayedQuizCard;