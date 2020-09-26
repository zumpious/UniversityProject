import React, {useState} from 'react';
import { Text, View, PermissionsAndroid } from 'react-native';
import {Button, Provider as PaperProvider} from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';

export function CreatePostScreen({ navigation }) {
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
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <PaperProvider>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Button
                    mode="contained"
                    color="#788eec"
                    labelStyle={{color: "white"}}
                    onPress={getLocationPermissionAndCoordinates}>
                    Get Location
                </Button>
                <Text>{position.latitude}</Text>
                <Text>{position.longitude}</Text>
            </View>
        </PaperProvider>
    );
}

export default CreatePostScreen;