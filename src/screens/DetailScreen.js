import React, {useContext, useState, useEffect} from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export function DetailScreen({ navigation }) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Post screen</Text>
            <Button
                title="Go To Home "
                mode="contained"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
}

export default  DetailScreen;