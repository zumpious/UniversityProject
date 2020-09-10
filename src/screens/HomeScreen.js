import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { View, Text, StyleSheet } from 'react-native';
import {Button} from "react-native-paper";

export function HomeScreen(props) {
    const user  = props.extraData;

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text>{'You have sucessfully logged in! \n Welcome back \n' + user.name}</Text>
                <Button icon="camera" mode="contained" onPress={() => {
                    console.log('test');
                    auth()
                        .signOut()
                        .then(() => console.log('user signed out'))
                        .catch((error) => {
                            alert(error);
                        });
                }}>
                    Press Me
                </Button>
            </View>
        </PaperProvider>
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