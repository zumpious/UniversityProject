import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export function HomeScreen(props) {
    return (
        <View style={styles.container}>
            <Text>{'You have sucessfully logged in! \n Welcome back \n' + props.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50
    }
});

export default HomeScreen;