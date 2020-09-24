import React from 'react';
import * as Progress from 'react-native-progress';
import {View, StyleSheet} from 'react-native';

//ToDo make Loading Animation more interesting and CD fitting
export function LoadingScreen() {
    return (
        <View style={[styles.container, styles.horizontal]}>
            <Progress.CircleSnail
                color={'#788eec'}
                hideWhenStopped={true}
                size={75}
                thickness={4}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

export default LoadingScreen;