import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export function HomeScreen(props, extraData) {
    return (
        <View style={styles.container}>
            <Text>{'You have sucessfully logged in! \n Welcome back \n' + props.extraData.email}</Text>
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