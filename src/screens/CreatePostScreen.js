import React, {useContext, useState} from 'react';
import {Text, View, PermissionsAndroid, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Button, Provider as PaperProvider, Title} from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';
import {AuthContext} from "../navigation/AuthNavigator";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export function CreatePostScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
        timestamp: null
    });

    //ToDo Upgrade this function and enable passing location via some map API (e.g. Google Maps)
    //ToDo implement error handling
    const getLocationPermissionAndCoordinates = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool Location App Permission",
                    message:
                        "Cool Location App needs access to your location",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        setPosition((prevState => ({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            timestamp: position.timestamp
                        })))
                    },
                    (error) => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
                console.log(position);
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    //ToDo think about a way that allows the user to easy delete the value of an input area (e.g. delete button inside the textInput)
    //ToDo rework styling and design of the buttons
    //ToDo display the used location data after fetching it next to its button
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

                <Title style={styles.title}>Title</Title>
                <TextInput
                    style={styles.input}
                    placeholder='Title'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Title style={styles.title}>Description</Title>
                <TextInput
                    style={[styles.input, styles.description]}
                    placeholder='Description'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    multiline = {true}
                    numberOfLines = {5}
                />

                <Title style={{marginLeft: 30}}>Add Location</Title>
                <TouchableOpacity
                    style={styles.buttonSmall}
                    onPress={getLocationPermissionAndCoordinates}>
                    <Text style={styles.buttonTitle}>Add Location  </Text>
                </TouchableOpacity>

                <Title style={{marginLeft: 30}}>Add Photo</Title>
                <TouchableOpacity
                    style={styles.buttonSmall}
                    onPress={() => {console.log('Photo Button')}}>
                    <Text style={styles.buttonTitle}>Add Photo  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonTall, styles.submitPost]}
                    onPress={() => console.log('Submit')}>
                    <Text style={styles.buttonTitle}>Submit Post  </Text>
                </TouchableOpacity>

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
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 25,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 5
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    description: {
        height: 96,
        marginTop: 10,
        marginBottom: 30
    },
    buttonSmall: {
        backgroundColor: '#ebbc86',
        marginTop: 10,
        marginBottom: 30,
        marginLeft: 30,
        height: 42,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: '40%'
    },
    buttonTall: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 52,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: '100%'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    submitPost: {
        width: '85%',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 50
    }
});

export default CreatePostScreen;