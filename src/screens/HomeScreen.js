import React, {useContext, useState, useEffect} from 'react';
import { Title, Provider as PaperProvider } from 'react-native-paper';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl,Dimensions, Linking} from 'react-native';
import { AuthContext } from "../navigation/AuthNavigator";
import firestore from "@react-native-firebase/firestore";
import Image from "react-native-scalable-image";
import LoadingScreen from "./animations/LoadingScreen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getGpsURL} from "../helpers/helpers";

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
    const [refreshing, setRefreshing] = useState(false);

    const user = useContext(AuthContext);
    const uid = user.uid
    const entityRef = firestore().collection('Users').doc(uid);

    const window = Dimensions.get('window');


    //refresh page handler
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(3000).then(() => setRefreshing(false));
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
                        entityRef
                            .get()
                            .then(firestoreDocument => {
                                const data = firestoreDocument.data();
                                setUserName(data.name);
                                setLoading(false);
                            })
                            .catch((e) => console.log("An error occurred getting a firestore document: ", e))
                    },2500)
                    return;
                }
                const data = firestoreDocument.data();
                setUserName(data.name);
            })
            .catch((e) => console.log("An error occurred getting a firestore document: ", e));
    }, []);

    //get firestore posts object and subscribe on refreshing state
    useEffect(() => {
        let mounted = true;
        entityRef
            .onSnapshot(documentSnapshot => {
                if(documentSnapshot.get('posts') != null && mounted) {
                    setPosts(documentSnapshot.data().posts)
                }
            });
        return () => mounted = false;
    },[refreshing])

    // get data from posts object and transform data into view
    // ToDo create a map link from longitude and latitude
    // ToDo every image should be displayed in same size
    let data = [];
    const getPostData = posts => {
        for (let index in posts) {
            if (posts.hasOwnProperty(index)) {
                const item = posts[index];

                data.unshift(
                    <View key={index} style={styles.postsContainer}>
                        <View style={styles.postsContainerTop}>
                            <Title styles={styles.title} id={item.title}>{item.title}</Title>
                        </View>
                        {item.image ?
                            <View>
                                <Image
                                    width={window.width}
                                    source={item.image && {uri: item.image}}
                                />
                            </View>:
                            null
                        }
                        <View style={styles.postsContainerBottom}>
                            <Text id={item.description}>{item.description}</Text>
                            <TouchableOpacity
                                onPress={() =>
                                Linking.openURL(getGpsURL(item.location.latitude, item.location.longitude))}
                            >
                                <Text style={styles.mapLink}>Goolge Maps</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: '#fff'
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
    title: {
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 30
    },
    postsContainer: {

    },
    postsContainerTop: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 10
    },
    postsContainerBottom: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 20
    },
    mapLink: {
        color: '#788eec',
        marginTop: 10
    }
})

export default HomeScreen;