import React from 'react';
import { Button, Text, View } from 'react-native';

export function ProfilScreen({ navigation }) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Profil Screen</Text>
            <Button
                title="Go To Home "
                mode="contained"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
}

export default ProfilScreen;