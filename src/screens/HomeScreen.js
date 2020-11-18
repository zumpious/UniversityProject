import React, {useContext, useState, useEffect} from 'react';
import { DefaultTheme, Button, Provider as PaperProvider } from 'react-native-paper';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image} from 'react-native';
import { AuthContext } from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';
import LoadingScreen from "./animations/LoadingScreen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

//ToDo implement advanced error handling
//ToDo split code into smaller components
export function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [posts, setPosts] = useState(null);
    const [downloadURL, setDownloadURL] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);

    const user = useContext(AuthContext);
    const uid = user.uid
    const entityRef = firestore().collection('Users').doc(uid);


    //refresh page handler
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    //get name of current user
    useEffect(() =>  {
        entityRef
            .get()
            .then(firestoreDocument => {
                // This was only added because after registration the firestore document might not be created yet and therefor can't be fetched immediately
                // TODO remove setTimeout() --> Update to JS promises
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
                            .catch((e) => console.log('An error occurred getting a firestore document: ', e))
                    },2500)
                    return;
                }
                const data = firestoreDocument.data()
                setUserName(data.name);
            })
            .catch((e) => console.log('An error occurred getting a firestore document: ', e));
    }, []);

    //get firestore posts object and subscribe on refreshing state
    useEffect(() => {
        entityRef
            .onSnapshot(documentSnapshot => {
                if(documentSnapshot.get('posts') != null) {
                    setPosts(documentSnapshot.data().posts)
                }
            });

    },[refreshing])


    //get image fetching working
    const getImageUrl = (filename) =>{
        let imageRef = storage().ref('/' + filename);

        imageRef
            .getDownloadURL()
            .then((url) => {
                return url
            })
    }

    //get data from posts object
    // ToDo display image instead of its name
    // ToDo create a map link from longitude and latitude
    let data = [];
    const getPostData = posts => {

        for (let index in posts) {
            if (posts.hasOwnProperty(index)) {
                const item = posts[index];

                console.log(item.image);
                data.push(
                    <View key={index}>
                        {item.image ?
                            <Image style={styles.imageBox} source={item.image && {uri: item.image}} /> :
                            null
                        }
                        <Text id={item.title}>{item.title}</Text>
                        <Text id={item.description}>{item.description}</Text>
                        <Text id={item.location.longitude}>{item.location.longitude}</Text>
                        <Text id={item.location.latitude}>{item.location.latitude}</Text>
                        <Text>{'\n \n'}</Text>
                    </View>,
                )
            }
        }
        return data;
    }

    return loading ? (
        <LoadingScreen />
    ) : (
        <PaperProvider>
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.userNameTouch}
                        onPress={() => {
                            navigation.navigate('Profil')
                        }}>
                        <Text style={styles.userNameText}>{userName.split(" ")[0]}  </Text>
                    </TouchableOpacity>
                </View>

                {posts ?
                    (<KeyboardAwareScrollView
                        style={{flex: 1, width: '100%'}}
                        keyboardShouldPersistTaps="always">
                            <ScrollView
                                style={styles.postsContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            >
                                <View>
                                    {getPostData(posts)}
                                </View>
                            </ScrollView>
                    </KeyboardAwareScrollView>) :
                    (<View style={styles.center}>
                        <TouchableOpacity
                            style={[styles.userNameTouch, {alignItems: 'center', marginTop: 0}]}
                            onPress={() => {
                                navigation.navigate('Post')
                            }}>
                            <Text>Es gibt aktuell keine Posts für dich.</Text>
                            <Text style={styles.userNameText}>Füge jetzt einen Post hinzu!  </Text>
                        </TouchableOpacity>
                    </View>)
                }
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userNameTouch: {
        alignItems: 'flex-end',
        marginTop: 30,
        marginRight: 30,
        marginBottom: 30,
    },
    userNameText: {
        fontSize: 18,
        color: '#788eec'
    },
    postsContainer: {
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30
    },
    imageBox: {
        marginLeft: 30,
        width: 300,
        height: 300
    }
})

export default HomeScreen;