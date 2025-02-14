import { TouchableOpacity, View } from "react-native";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";

type BaseSettingItemProps = {
    title: string;
    description?: string;
    onPress?: () => void;
};

type WithSwitchProps = BaseSettingItemProps & {
    hasSwitch: true;
    switchValue: boolean;
    onSwitchChange: (value: boolean) => void;
};

type WithoutSwitchProps = BaseSettingItemProps & {
    hasSwitch?: false;
    switchValue?: never;
    onSwitchChange?: never;
};

type SettingItemProps = WithSwitchProps | WithoutSwitchProps;

const SettingItem = ({
    title,
    description,
    hasSwitch,
    onPress,
    switchValue = false,
    onSwitchChange = () => {}
}: SettingItemProps) => (
    <TouchableOpacity 
        className="w-full py-4" 
        onPress={onPress}
        disabled={!onPress}
    >
        <View className="flex-row justify-between items-center">
            <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                    {title}
                </Text>
                {description && (
                    <Text className="text-sm text-muted-foreground">
                        {description}
                    </Text>
                )}
            </View>
            {hasSwitch && (
                <Switch 
                    checked={switchValue}
                    onCheckedChange={onSwitchChange}
                />
            )}
        </View>
    </TouchableOpacity>
);

export default SettingItem;