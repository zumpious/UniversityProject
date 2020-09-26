import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Provider as PaperProvider} from "react-native-paper";
import auth from "@react-native-firebase/auth";
import {AuthContext} from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "./animations/LoadingScreen";

export function ProfilScreen({ navigation }) {
const [loading, setLoading] = useState(false)
const [userName, setUserName] = useState('')

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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.text}>{ userName }</Text>
                <Button
                    mode="contained"
                    color="#788eec"
                    labelStyle={{color: "white"}}
                    onPress={() => {
                        auth()
                            .signOut()
                            .then(() => {
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    }}>
                    Log Out
                </Button>
            </View>
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
    text: {
        fontSize: 18,
        paddingBottom: 12
    }
})

export default ProfilScreen;