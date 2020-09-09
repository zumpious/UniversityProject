import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator} from "@react-navigation/stack";
//import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { decode, encode } from 'base-64';

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

    return (
        <NavigationContainer>
            <Stack.Navigator>
                { user ? (
                    <Stack.Screen name="Home" component={HomeScreen}/>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Registration" component={RegisterScreen} />
                        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;