import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';

export function LoginScreen({navigation}) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    //ToDo implement advanced error handling
    const onLoginPress = () => {
        if (email === null && password === null) {
            return;
        } else if(email === null && password !== null) {
            setEmailErr(true);
            return;
        } else if (email !== null && password === null){
            setPasswordErr(true);
            return;
        }

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((err) =>{
                setEmail(null);
                setPassword(null);
                setEmailErr(null);
                setPasswordErr(null);

                setError(true);

                if(err.code === "auth/invalid-email"){
                    setErrorMsg("You entered a wrong email. Please try again!");
                } else if (err.code === "auth/wrong-password"){
                    setErrorMsg("You entered a wrong password. Please Try Again!");
                } else if (err.code === "auth/user-not-found"){
                    setErrorMsg("User not found. Please Try Again!");
                } else {
                    setErrorMsg("Something went wrong. Please Log In again");
                }
            });

    }

    return (
        <View style={styles.container}>
            {error ?
                (<Text style={styles.errorText}>{errorMsg}</Text>) :
                null
            }
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={emailErr ? styles.inputRed : styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={passwordErr ? styles.inputRed : styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log In </Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Text onPress={onFooterLinkPress} style={styles.footerLink}> Sign Up </Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
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
        paddingLeft: 16,
    },
    inputRed: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: 'red'
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 30,
        marginBottom: 20
    }
})

export default LoginScreen;