import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBOe8L7rDyxZeLVQHN3FftKg84_37HVDaY",
    authDomain: "verbum-eecf6.firebaseapp.com",
    projectId: "verbum-eecf6",
    storageBucket: "verbum-eecf6.firebasestorage.app",
    messagingSenderId: "67260283984",
    appId: "1:67260283984:web:763ab499d3c762202aa555"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);