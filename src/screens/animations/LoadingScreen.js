import React from 'react';
import * as Progress from 'react-native-progress';
import {View, StyleSheet, Text} from 'react-native';

//ToDo make Loading Animation more interesting and CD fitting
export function LoadingScreen(props) {
    return (
        <View style={styles.container}>
            <Progress.CircleSnail
                color={'#788eec'}
                hideWhenStopped={true}
                size={75}
                thickness={4}
            />
            {props.uploading ?
                <Text>Uploading...</Text> :
                null
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10
    }
});

export default LoadingScreen;