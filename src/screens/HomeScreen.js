import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native'

export function HomeScreen(props) {
    console.log(props.route.params.user.name);
    const user  = props.userData;
    const navigation = useNavigation();

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text>{'You have sucessfully logged in! \n Welcome back \n' + user.name}</Text>
                <Button mode="contained" onPress={() => {
                    console.log('test');
                    auth()
                        .signOut()
                        .then(() => {
                            console.log('signOut');
                            navigation.navigate('Login');
                        })
                        .catch((error) => {
                            alert(error);
                        });
                }}>
                    Log Out
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