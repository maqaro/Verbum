import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Headerspace = () => {
    const insets = useSafeAreaInsets();
    
    return (
        <View 
            className="w-full bg-background" 
            style={{ paddingTop: insets.top }}
        />
    );
};

export default Headerspace;