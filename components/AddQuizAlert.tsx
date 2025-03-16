import React, { useState } from "react";
import { View, Modal } from "react-native";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react-native";
import { Text } from "./ui/text";
import { Input } from "./ui/input";
import { FIREBASE_AUTH, FIREBASE_DB } from "~/FirebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, addDoc, collection } from "firebase/firestore";

const SUPPORTED_LANGUAGES = [
    { value: "AR", label: "Arabic" },
    { value: "ES", label: "Spanish" },
    { value: "FR", label: "French" },
];

const AddQuizAlert = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [quizName, setQuizName] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("EN");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    
    const user = FIREBASE_AUTH.currentUser;
    
    const createNewQuiz = async () => {
        if (!user?.email || !quizName.trim()) {
            setError("Please enter a quiz name");
            return;
        }
        
        try {
            setIsCreating(true);
            setError("");
            
            const quizData = {
                info: {
                    isOriginal: true,
                    languageCode: selectedLanguage,
                    name: quizName,
                    nameLower: quizName.toLowerCase(),
                    owner: user.email,
                    scansAdded: 0,
                    timesPlayed: 0,
                    wordsLearnt: 0,
                },
                data: {}
            };
            
            // Create the quiz in Firestore
            const quizRef = await addDoc(collection(FIREBASE_DB, "quizzes"), quizData);
            
            // Update the user's quizzes list
            const userRef = doc(FIREBASE_DB, "userInfo", user.email);
            await updateDoc(userRef, {
                "quizzes.userQuizzes": arrayUnion({
                    id: quizRef.id,
                    name: quizName,
                    languageCode: selectedLanguage,
                })
            });
            
            // Reset form and close modal
            setQuizName("");
            setSelectedLanguage("EN");
            setModalVisible(false);
            
        } catch (error) {
            console.error("Error creating quiz:", error);
            setError("Failed to create quiz. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleCancel = () => {
        setQuizName("");
        setSelectedLanguage("AR");
        setError("");
        setModalVisible(false);
    };
    
    return (
        <View className="pt-4">
            <Button className="bg-secondary" onPress={() => {setModalVisible(true)}}>
                <CirclePlus className="color-primary p-4"/>
            </Button>
            
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={handleCancel}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="m-5 bg-secondary rounded-3xl p-6 items-center w-5/6">
                        <Text className="text-3xl font-bold mb-6">Create New Quiz</Text>
                        
                        <View className="w-full mb-4">
                            <Text className="text-base font-medium mb-2">Quiz Name</Text>
                            <Input
                                value={quizName}
                                onChangeText={setQuizName}
                                placeholder="Enter quiz name"
                                className="w-full bg-background"
                            />
                        </View>
                        
                        <View className="w-full mb-4">
                            <Text className="text-base font-medium mb-2">Language</Text>
                            <View className="flex-row flex-wrap">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <Button 
                                        key={lang.value}
                                        className={`mr-2 mb-2 ${selectedLanguage === lang.value ? "bg-violet-600" : "bg-background"}`}
                                        onPress={() => setSelectedLanguage(lang.value)}
                                    >
                                        <Text className={selectedLanguage === lang.value ? "text-primary" : "text-white"}>
                                            {lang.label}
                                        </Text>
                                    </Button>
                                ))}
                            </View>
                        </View>
                        
                        {error ? (
                            <Text className="text-red-500 mb-2">{error}</Text>
                        ) : null}
                        
                        <View className="flex-row justify-end w-full mt-4">
                            <Button 
                                variant="outline" 
                                className="mr-2" 
                                onPress={handleCancel}
                            >
                                <Text>Cancel</Text>
                            </Button>
                            <Button 
                                onPress={createNewQuiz} 
                                disabled={isCreating || !quizName.trim()}
                                className="bg-violet-600"
                            >
                                <Text className="color-primary">{isCreating ? "Creating..." : "Create Quiz"}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddQuizAlert;