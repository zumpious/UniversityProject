import React, {useContext, useState} from 'react';
import {Text,
        View,
        PermissionsAndroid,
        StyleSheet,
        TextInput,
        TouchableOpacity,
        Image,
        SafeAreaView} from 'react-native';
import {Title} from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-picker';
import {createUUIDv4} from "../helpers/helpers";
import {AuthContext} from '../navigation/AuthNavigator';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import LoadingScreen from "./animations/LoadingScreen";

//ToDo split code into smaller components
//ToDo remove console.logs and implement advanced error handling to every function
export function CreatePostScreen({ navigation }) {
    //Create firestore References
    const postRef = firestore().collection('Users');
    const user = useContext(AuthContext);
    const uid = user.uid;

    //Firestore document relative data
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
        timestamp: null
    });

    //Needed to handle invalid input
    const [titleErr, setTitleErr] = useState(false);
    const [desrciptionErr, setDescriptionErr] = useState(false);
    const [positionErr, setPositionErr] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);

    //Get and upload image data
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);


    // It does take some time for the geolocation service to fetch to current location,
    // consequently if the user posts before the location service returned to location the data
    // send to firestore is empty
    //ToDo fix behavior described above
    //ToDo Upgrade this function and enable passing location via some map API (e.g. Google Maps)
    const getLocationPermissionAndCoordinates = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool location app permission",
                    message:
                        "Cool location app needs access to your location",
                    buttonNeutral: "Ask me later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //ToDo double check that latitude and longitude are not null
                //ToDo tell the user to try again if coords null
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
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
                );
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    //ToDo Add resize functionality after Image selection
    const selectImage = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = {uri: response.uri};
                setImage(source);
            }
        });
    };

    //ToDo check that data properties are not null
    //ToDo implement advanced error handling
    const submitPost = async () => {
        //reset erros
        setError(false);
        setErrorMsg(null);
        setTitleErr(null);
        setDescriptionErr(null);
        setPositionErr(null);

        //Null check and show the user what input is missing
        if (title === null && description === null && position.latitude === null) {
            setError(true);
            setErrorMsg("Please enter the required values! (Title, Description and Location Parameters)");
            return;
        } else if(title === null){
            setTitleErr(true);
            return;
        } else if(description === null){
            setDescriptionErr(true);
            return;
        } else if(position.longitude === null) {
            setPositionErr(true);
            return;
        }

        //generate PostID
        const postID = createUUIDv4();

        //Post data with Image
        if (image !== null) {
        const {uri} = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);

        //upload Image to firebase storage
        storage()
            .ref(filename)
            .putFile(uploadUri)
            .on(
                'state_changed',
                snapshot => {
                    console.log("snapshot: " + snapshot);
                },
                error => {
                    console.log('uploading image error => ' + error);
                },
                () => {
                    storage()
                        .ref(filename)
                        .getDownloadURL()
                        .then((downloadUrl) => {
                            //Create data object
                            let post = {
                                title: title,
                                description: description,
                                location: {
                                    timestamp: position.timestamp,
                                    longitude: position.longitude,
                                    latitude: position.latitude
                                },
                                postID: postID,
                                image: downloadUrl
                            };

                            //post data object to firestore document of user
                            postRef
                                .doc(uid)
                                .update({
                                    //Add new post to the end of posts array
                                    posts: firestore.FieldValue.arrayUnion(post),
                                })
                                .then(() => {
                                    console.log('post added to Users document')
                                })
                                .catch((e) => console.log('An error occurred uploading the image: ', e));
                            setTitle(null);
                            setDescription(null);
                            setPosition((prevState => ({
                                latitude: null,
                                longitude: null,
                                timestamp: null
                            })));

                            setImage(null);
                            setUploading(false);

                            setTitleErr(false);
                            setDescriptionErr(false);
                            setPositionErr(false);
                            setError(false);
                            setErrorMsg(null);
                        })
                }
            );
        } else {
            //Create data object without uploading an image to firebase storage
            let post = {
                title: title,
                description: description,
                location: {
                timestamp: position.timestamp,
                    longitude: position.longitude,
                    latitude: position.latitude
            },
                postID: postID,
                image: null
            };

            //post data object to firestore document of its user
            postRef
                .doc(uid)
                .update({
                    //Add new post to the end of posts array
                    posts: firestore.FieldValue.arrayUnion(post),
                })
                .then(() => {
                    console.log('Post added to Users document')
                })
                .catch((e) => console.log('An error occurred posting data to firestore document: ', e));
            setTitle(null);
            setDescription(null);
            setPosition((prevState => ({
                latitude: null,
                longitude: null,
                timestamp: null
            })));
            setTitleErr(false);
            setDescriptionErr(false);
            setPositionErr(false);
            setError(false);
            setErrorMsg(null);
        }
    }

    //ToDo think about a way that allows the user to easy delete the value of an input area (e.g. delete button inside the textInput)
    //ToDo rework styling and design of the buttons
    //ToDo display the used location data after fetching it, e.g. next to its button or remove the location button and fetch coords on post submit
    return ( uploading ? (
        <LoadingScreen uploading={true} />
        ) : (
        <View style={styles.container}>
            {error ?
                (<Text style={styles.errorText}>{errorMsg}</Text>) :
                null
            }
            <KeyboardAwareScrollView
                style={{flex: 1, width: '100%'}}
                keyboardShouldPersistTaps="always">

                <Title style={styles.title}>Title</Title>
                <TextInput
                    style={titleErr ? styles.inputRed : styles.input}
                    placeholder='Title'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Title style={styles.title}>Description</Title>
                <TextInput
                    style={desrciptionErr ? [styles.inputRed, styles.description] : [styles.input, styles.description]}
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
                {positionErr ?
                    (<Text style={[styles.errorText, {marginTop: 5, marginBottom: 5}]}>
                    Please add location parameters!</Text>) :
                    null
                }
                <TouchableOpacity
                    style={styles.buttonSmall}
                    onPress={getLocationPermissionAndCoordinates}>
                    <Text style={styles.buttonTitle}>Add Location  </Text>
                </TouchableOpacity>

                <Title style={{marginLeft: 30}}>Add Photo</Title>
                <SafeAreaView>
                    <TouchableOpacity style={styles.buttonSmall} onPress={selectImage}>
                        {image === null ?
                            (<Text style={styles.buttonTitle}>Pick an image  </Text>) :
                            (<Text style={styles.buttonTitle}>Change image  </Text>)
                        }
                    </TouchableOpacity>
                    <View>
                        {image !== null ?
                            (<Image source={{uri: image.uri}} style={styles.imageBox} />) :
                            null
                        }
                    </View>
                </SafeAreaView>

                <TouchableOpacity
                    style={[styles.buttonTall, styles.submitPost]}
                    onPress={submitPost}>
                    <Text style={styles.buttonTitle}>Submit Post  </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </View>
        )
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
        marginBottom: 40,
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
    imageBox: {
        marginLeft: 30,
        width: 300,
        height: 300
    },
    progressBarContainer: {
        marginTop: 20,
        marginLeft: 30
    },
    submitPost: {
        width: '85%',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 50
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 30
    }
});

export default CreatePostScreen;