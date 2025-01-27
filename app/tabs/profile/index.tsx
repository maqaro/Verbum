import { View, Text } from "react-native";
import { Button } from "~/components/ui/button";

const Profile = () => {
    return (
        <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
            <Text>Profile Page</Text>
            <Button className="bg-primary">
                <Text>Default</Text>
            </Button>
        </View>
    )
}

export default Profile;