import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

interface HeaderspaceProps {
    title?: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    leftElement?: React.ReactNode;
}

const Headerspace = ({ title, subtitle, rightElement, leftElement }: HeaderspaceProps) => {
    return (
        <View className="w-full px-4 py-6 bg-background border-b border-border">
            <View className="flex-row items-center justify-between">
                {leftElement && (
                    <View className="w-12">
                        {leftElement}
                    </View>
                )}
                
                <View className="flex-1 items-center gap-1">
                    {title && (
                        <Text className="text-2xl font-bold text-foreground">{title}</Text>
                    )}
                    {subtitle && (
                        <Text className="text-sm text-muted-foreground">{subtitle}</Text>
                    )}
                </View>

                {rightElement && (
                    <View className="w-12 items-end">
                        {rightElement}
                    </View>
                )}
            </View>
        </View>
    );
};

export default Headerspace;

