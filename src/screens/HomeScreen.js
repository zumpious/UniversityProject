import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen({route, navigation}) {
    const { user } = route.params;
    console.log(user);
    return (
        <View style={styles.container}>
            <Text>{'You have sucessfully logged in! \n Welcome back \n' + user.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    }
})

export default HomeScreen;