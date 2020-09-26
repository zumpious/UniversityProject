import React, {useContext, useState, useEffect} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import { AuthContext } from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import LoadingScreen from "./animations/LoadingScreen";

export function HomeScreen({ navigation }) {
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
                <Text>{'You have sucessfully logged in! \n Welcome back \n' + userName}</Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Profil')}
                    color="#788eec"
                    labelStyle={{color: "white"}}
                >
                    Profil
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