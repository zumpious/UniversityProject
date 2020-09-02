import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export function Main ()  {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Button mode="contained" icon="camera" color="#aaa" onPress={() => console.log('Pressed')}>
                    Press Me
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#eaeff1",
        padding: 20,
        margin: 10,
    },
    top: {
        flex: 0.3,
        backgroundColor: "grey",
        borderWidth: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});

export default Main;