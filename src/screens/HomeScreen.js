import React, {useContext, useState, useEffect} from 'react';
import { DefaultTheme, Button, Provider as PaperProvider } from 'react-native-paper';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { AuthContext } from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "./animations/LoadingScreen";
import auth from "@react-native-firebase/auth";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const user = useContext(AuthContext);

    //get name of current user
    useEffect(() =>  {
        const uid = user.uid
        firestore()
            .collection('Users')
            .doc(uid)
            .get()
            .then(firestoreDocument => {
                // TODO remove setTimeout()
                // This was only added because after registration the firestore document might not be created yet and therefor can't be fetched immediately
                if (!firestoreDocument.exists) {
                    setLoading(true);
                    setTimeout(() => {
                        firestore()
                            .collection('Users')
                            .doc(uid)
                            .get()
                            .then(firestoreDocument => {
                                const data = firestoreDocument.data()
                                setUserName(data.name);
                                setLoading(false)
                            })
                    },2500)
                    return;
                }
                const data = firestoreDocument.data()
                setUserName(data.name);
            })
            //ToDo implement error handling
            .catch(error => {
                alert(error)
            });
    });

    return loading ? (
        <LoadingScreen />
    ) : (
        <PaperProvider>
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.userNameTouch}
                        onPress={() => {
                            navigation.navigate('Profil')
                        }}>
                        <Text style={styles.userNameText}>{userName.split(" ")[0]}  </Text>
                    </TouchableOpacity>
                </View>



                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">

                    <ScrollView style={styles.postsContainer}>

                    </ScrollView>

                </KeyboardAwareScrollView>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    userNameTouch: {
        alignItems: 'flex-end',
        marginTop: 30,
        marginRight: 30,
        marginBottom: 30,
    },
    userNameText: {
        fontSize: 18,
        color: '#788eec'
    },
    postsContainer: {
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30
    }
})

export default HomeScreen;