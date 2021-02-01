import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from "../screens/HomeScreen";
import ProfilScreen from "../screens/ProfilScreen";
import CreatePostScreen from "../screens/CreatePostScreen";

const Tab = createBottomTabNavigator();

//MAIN TASK
export default function SignInTab() {

    return(
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused
                                ? 'home'
                                : 'home-outline';
                        } else if (route.name === 'Post') {
                            iconName = focused
                                ? 'create'
                                : 'create-outline';
                        } else if (route.name === 'Profil') {
                            iconName = focused
                                ? 'person'
                                : 'person-outline';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{activeTintColor: '#788eec', inactiveTintColor: 'gray',}}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Post" component={CreatePostScreen} />
                <Tab.Screen name="Profil" component={ProfilScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )

}