import { TouchableOpacity, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import React from "react";
import { router } from "expo-router";
import FlagAvatar from "./FlagAvatar";

const LANGUAGE_FLAGS = [
    { value: "AR", path: "../images/flags/SA" },
    { value: "ES", path: "../images/flags/ES" },
    { value: "FR", path: "../images/flags/FR" },
];

type QuizCardProps = {
    name: string;
    progress: number;
    quizId: string;
    languageCode: string;
};

const QuizCard = ({ 
    name, 
    progress,
    quizId,
    languageCode
    
} : QuizCardProps) => {
    const handleStartQuiz = (quizId: string) => {
        router.push({
            pathname: '/tabs/lessons/[id]',
            params: { 
                id: quizId,
            }
        });
    };

    return (
        <TouchableOpacity onPress={() => handleStartQuiz(quizId)} className="w-full">
            <Card className="bg-card w-full mb-4">
                <CardContent className="flex-row pb-2 items-center">
                    <View className="flex-1">
                        <Text className="text-2xl text-primary font-bold">{name}</Text>
                        <Text className="text-primary/50 mb-4">Tap to Expand</Text>
                        <Progress className="h-6" value={progress} max={100}/>
                    </View>
                    <View className="p-4 pr-0 items-center">
                        <Avatar alt="Avatar" className="w-24 h-24">
                            <FlagAvatar languageCode={languageCode}/>
                        </Avatar>
                    </View>
                </CardContent>
            </Card>
        </TouchableOpacity>
    );
};

export default QuizCard;