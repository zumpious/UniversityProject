import React, { useState, useEffect, createContext } from 'react';
import auth from '@react-native-firebase/auth';
import SignInTab from "./SignInTab";
import SignOutStack from "./SignOutStack";
import LoadingScreen from "../screens/animations/LoadingScreen";

export const AuthContext = createContext(null)

//SMALL TASK
export default function AuthNavigator() {
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState(null)

    // Handle user state changes
    function onAuthStateChanged(result) {
        setUser(result)
        if (initializing) setInitializing(false)
    }

    useEffect(() => {
        const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged)

        // unsubscribe on unmount
        return authSubscriber
    }, [])

    if (initializing) {
        return(
            <LoadingScreen />
        )
    }

    return user ? (
        <AuthContext.Provider value={user}>
            <SignInTab />
        </AuthContext.Provider>
    ) : (
        <SignOutStack />
    )
}
