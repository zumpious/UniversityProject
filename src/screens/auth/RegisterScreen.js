import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

//ToDo add USERNAME input
export default function RegistrationScreen({navigation}) {
    const [fullName, setFullName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const [fullNameErr, setFullNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        //Reset errors
        setError(false);
        setErrorMsg(null);
        setFullNameErr(false);
        setEmailErr(false);
        setPasswordErr(false);
        setConfirmPasswordErr(false);

        //Null check and show the user what input is missing
        if (fullName === null && email === null && password === null && confirmPassword === null) {
            setError(true);
            setErrorMsg("Please enter the required values!");
            return;
        } else if(fullName === null) {
            setFullNameErr(true);
            return;
        } else if(email === null) {
            setEmailErr(true);
            return;
        } else if (password === null){
            setPasswordErr(true);
            return;
        } else if (confirmPassword === null) {
            setConfirmPasswordErr(true);
            return;
        }

        //Check that passwords match
        if (password !== confirmPassword) {
            setError(true);
            setErrorMsg("Passwords don't match!");
            return;
        }

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid;
                const data = {
                    id: uid,
                    email: email,
                    name: fullName,
                    posts: null,
                    friends: null,
                    profilPicture: null,
                    nickname: null,
                    bio: null,
                };
                firestore()
                    .collection('Users')
                        .doc(uid)
                        .set(data)
                    .catch((error) => {
                        //ToDo add error handling
                        console.log("An error occured while creating a user: ", error);
                    });
            })
            .catch((err) => {
                setFullName(null);
                setEmail(null);
                setPassword(null);
                setConfirmPassword(null);

                setFullNameErr(false);
                setEmailErr(false);
                setPasswordErr(false);
                setConfirmPasswordErr(false);

                setError(true);

                //Show invalid input to user
                if (err.code === "auth/invalid-email"){
                    setErrorMsg("You entered an invalid E-Mail. Please try again!");
                } else if (err.code === "auth/email-already-in-use") {
                    setErrorMsg("The E-Mail you entered is already in use. Please choose another adress.")
                } else if (err.code === "auth/weak-password") {
                    setErrorMsg("The given password is invalid. It should at least contain 6 characters.")
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
                style={{flex: 1, width: '100%'}}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={fullNameErr ? styles.inputRed : styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={emailErr ? styles.inputRed : styles.input}
                    placeholder='E-Mail'
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
                <TextInput
                    style={confirmPasswordErr ? styles.inputRed : styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create Account  </Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account?</Text>
                    <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log In </Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
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
        paddingLeft: 16
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
        marginBottom: 20,
        marginLeft: 30
    }
});