import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Provider as PaperProvider} from "react-native-paper";
import auth from "@react-native-firebase/auth";
import {AuthContext} from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "./animations/LoadingScreen";

export function ProfilScreen({ navigation }) {
const [loading, setLoading] = useState(false);
const [userData, setUserData] = useState('');
const [postsCount, setPostsCount] = useState(0);

const user = useContext(AuthContext);

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
                            const data = firestoreDocument.data();
                            setUserData(data);
                            setLoading(false)
                        })
                },2500)
                return;
            }
            const data = firestoreDocument.data()
            setUserData(data);
            setPostsCount(data.posts.length);
        })
        //ToDo implement error handling
        .catch(error => {
            console.log('Something went wrong fetching user data from firestore:  ', error);
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
                        auth()
                            .signOut()
                            .then(() => {
                            })
                            .catch((error) => {
                                console.log('Something went wrong signing out', error);
                            })
                    }}>
                    <Text style={styles.userNameText}>Log Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Text style={styles.text}>Name: { userData.name }</Text>
                <Text style={styles.text}>Email: { userData.email }</Text>
                <Text style={styles.text}>Number of posts: {postsCount}</Text>
            </View>
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
    text: {
        fontSize: 18,
        paddingBottom: 12
    },
    body: {
        marginLeft: 30,
        marginTop: 30
    },
})

export default ProfilScreen;