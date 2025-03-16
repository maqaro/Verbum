import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

const LANGUAGE_FLAG_SOURCES = {
    AR: require("../assets/images/flags/SA.png"),
    ES: require("../assets/images/flags/ES.png"),
    FR: require("../assets/images/flags/FR.png"),
};

type FlagAvatarProps = {
    languageCode: string;
};

const FlagAvatar: React.FC<FlagAvatarProps> = ({ languageCode }) => {
    const avatarSource = LANGUAGE_FLAG_SOURCES[languageCode as keyof typeof LANGUAGE_FLAG_SOURCES];

    return (
        <>
            {avatarSource ? (
                <AvatarImage source={avatarSource} />
            ) : (
                <AvatarFallback>
                    <Text className="text-2xl font-bold text-foreground">{languageCode}</Text>
                </AvatarFallback>
            )}
        </>
    );
};

export default FlagAvatar;