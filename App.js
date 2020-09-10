import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import { decode, encode } from 'base-64';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export function App() {
    // Set an initializing state whilst Firebase connects
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const usersRef = firestore().collection('Users');
        auth().onAuthStateChanged(user => {
            if (user) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data()
                        setLoading(false)
                        setUser(userData)
                    })
                    .catch((error) => {
                        setLoading(false)
                    });
            } else {
                setLoading(false)
            }
        });
    }, []);

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                { user ? (
                    <Stack.Screen name="Home">
                        {props => <HomeScreen {...props} extraData={user} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Registration" component={RegisterScreen} />
                        <Stack.Screen name="Home" component={HomeScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;