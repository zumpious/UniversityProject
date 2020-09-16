import React, {useContext, useState, useEffect} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
//import { useNavigation } from '@react-navigation/native'
import { AuthContext } from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export function HomeScreen(props) {
    const [userName, setUserName] = useState('')

    const user = useContext(AuthContext);

    useEffect(() =>  {
        const uid = user.uid
        firestore()
            .collection('Users')
            .doc(uid)
            .get()
            .then(firestoreDocument => {
                if (!firestoreDocument.exists) {
                    alert("User does not exist anymore.")
                    return;
                }
                const data = firestoreDocument.data()
                setUserName(data.name);
            })
            .catch(error => {
                alert(error)
            });
    });

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text>{'You have sucessfully logged in! \n Welcome back \n' + userName}</Text>
                <Button mode="contained" onPress={() => {
                    console.log('test111');
                    auth()
                        .signOut()
                        .then(() => {
                            console.log('signOut');
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