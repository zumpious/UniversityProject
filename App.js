import React, {useState, useEffect} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import HomeScreen from "./screens/HomeScreen";

/*
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#009be5',
        background: '#eaeff1',
        text: '#fff',
        surface: '#232f3e'
    }
}
*/
export function App() {
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        /*auth()
            .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });


        return (
            <View>
                <Text>Login</Text>
            </View>
        );

         */

        console.log('No user here')
    }

    return (
        <PaperProvider>
            <View>
                <HomeScreen name={user.email}/>
            </View>
        </PaperProvider>
    );
}

export default App;