import { router, Stack } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "~/FirebaseConfig";
import "../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        router.replace("/tabs/home");
      } else {
        router.replace("/auth-screen");
      }
    }, (error) => {
      console.error(error);
      setLoading(false);
    });


    return () => unsubscribe();
  }, []);


  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="auth-screen" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
