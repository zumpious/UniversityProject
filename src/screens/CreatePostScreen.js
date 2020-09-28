import React, {useContext, useState} from 'react';
import {Text,
        View,
        PermissionsAndroid,
        StyleSheet,
        TextInput,
        TouchableOpacity,
        Image,
        Alert,
        SafeAreaView } from 'react-native';
import {Button, Provider as PaperProvider, Title} from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-picker';
import {AuthContext} from '../navigation/AuthNavigator';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


//ToDo split component into smaller pieces
//ToDo remove console.logs and implement advanced error handling to every function
export function CreatePostScreen({ navigation }) {
    //Firestore document relative data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
        timestamp: null
    });

    //Get and upload image data
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    //ToDo why does the user has to fetch the location multiple times before it works? --> Fix BUG
    //ToDo Upgrade this function and enable passing location via some map API (e.g. Google Maps)
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
                console.log(position);
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

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
                console.log(source);
                setImage(source);
            }
        });
    };

    const uploadImage = async () => {
        if (image !== null){
            const {uri} = image;
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            console.log(filename);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

            setUploading(true);
            setTransferred(0);

            //upload Image
            const task = storage()
                .ref(filename)
                .putFile(uploadUri);

            // set progress state
            task.on('state_changed', snapshot => {
                setTransferred(
                    Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
                );
            });

            try {
                await task;
            } catch (e) {
                console.error(e);
            }
            setUploading(false);
            Alert.alert(
                'Photo uploaded!',
                'Your photo has been uploaded to Firebase Cloud Storage!'
            );
            setImage(null);
        }
        else {
            console.log('no Image selected')
        }
    };

    //creating a firestore document of the created post
    const submitPost = () => {

    }

    //ToDo think about a way that allows the user to easy delete the value of an input area (e.g. delete button inside the textInput)
    //ToDo rework styling and design of the buttons
    //ToDo display the used location data after fetching it, e.g. next to its button or remove the location button and fetch coords on post submit
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
                <SafeAreaView>
                    <TouchableOpacity style={styles.buttonSmall} onPress={selectImage}>
                        {image === null ?
                            (<Text style={styles.buttonTitle}>Pick an image  </Text>) :
                            (<Text style={styles.buttonTitle}>Change image  </Text>)
                        }
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {image !== null ?
                            (<Image source={{ uri: image.uri }} style={styles.imageBox} />) :
                            null
                        }
                        {/*uploading ?
                            (<View style={styles.progressBarContainer}>
                                <Progress.Bar progress={transferred} width={300} />
                            </View>) :
                            (<TouchableOpacity style={styles.buttonSmall} onPress={uploadImage}>
                                <Text style={styles.buttonTitle}>Upload image  </Text>
                            </TouchableOpacity>)
                        */}
                    </View>
                </SafeAreaView>

                <TouchableOpacity
                    style={[styles.buttonTall, styles.submitPost]}
                    onPress={submitPost}>
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
    }
});

export default CreatePostScreen;