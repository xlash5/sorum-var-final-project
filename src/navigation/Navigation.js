import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Leaderboard from '../screens/home/Leaderboard';
import NewQuestion from '../screens/home/NewQuestion';

import Splash from '../screens/Splash';

import { Palette } from '../theme/Colors';
import { Button } from 'react-native-paper';

import AuthStackScreen from './AuthStackScreen';
import ProfileStackScreen from './ProfileStackScreen';
import HomeStackScreen from './HomeStackScreen';
import SolvedQuestionsScreen from './SolvedQuestionsScreen';

const Tab = createBottomTabNavigator();

function TabStackScreen() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconName;

                        if (route.name === 'Ana Sayfa') {
                            iconName = 'book';
                        } else if (route.name === 'Puan Durumu') {
                            iconName = 'sort-numeric-asc';
                        } else if (route.name === 'Yeni Soru') {
                            iconName = 'plus-square';
                        } else if (route.name === 'Profil') {
                            iconName = 'user';
                        } else if (route.name === 'Çözülmüş') {
                            iconName = 'check-circle-o'
                        }

                        return <Icon name={iconName} size={24} color={Palette.dark} />;
                    },
                    tabBarActiveTintColor: Palette.dark,
                    tabBarActiveBackgroundColor: Palette.darkOrange,
                    tabBarInactiveTintColor: Palette.dark,
                    tabBarInactiveBackgroundColor: Palette.orange,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12.0,
                        fontWeight: "bold",
                        color: Palette.dark,
                    }
                })}>
                <Tab.Screen
                    name="Ana Sayfa"
                    component={HomeStackScreen}
                />
                <Tab.Screen
                    name="Puan Durumu"
                    component={Leaderboard}
                />
                <Tab.Screen
                    name="Yeni Soru"
                    component={NewQuestion}
                />
                <Tab.Screen
                    name="Çözülmüş"
                    component={SolvedQuestionsScreen}
                />
                <Tab.Screen
                    name="Profil"
                    component={ProfileStackScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const Navigation = () => {
    const notificationDoc = firestore().collection('Notifications').doc(auth().currentUser ? auth().currentUser.uid : 'auth().currentUser.uid');
    const [notificationData] = useDocumentData(notificationDoc);

    const [showSplash, setShowSplash] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });
    }, [auth()])

    useEffect(() => {
        if (notificationData) {
            setShowNotificationModal(notificationData.hasNotification)
        }
    }, [notificationData])

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false);
        }, 3500)
    }, []);


    const deleteNotification = () => {
        firestore()
            .collection('Notifications')
            .doc(auth().currentUser.uid)
            .update({
                hasNotification: false,
            })
            .then(() => {
                console.log('Notification deleted!');
            })
            .catch(e => {
                console.log(e);
            });
    }


    if (showSplash) {
        return <Splash />;
    }

    if (!loggedIn) {
        return <AuthStackScreen />;
    }

    return <SafeAreaView style={{ flex: 1 }}>
        <TabStackScreen />
        <Modal visible={showNotificationModal} transparent={true}>
            <View style={styles.modal} >
                <LottieView
                    source={require('../assets/lottie/std.json')}
                    autoPlay
                    loop
                    style={styles.modalAnimation} />
                <Text>Cevaplanmış sorunuz var!</Text>
                <Button
                    mode="contained"
                    onPress={deleteNotification}
                    style={styles.modalButton}
                    color={Palette.darkOrange}
                >
                    TAMAM
                </Button>
            </View>
        </Modal>
    </SafeAreaView>;
}

export default Navigation;

const styles = StyleSheet.create({
    modal: {
        alignSelf: 'center',
        marginTop: '30%',
        width: '85%',
        height: '60%',
        backgroundColor: Palette.orange,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderWidth: 5.0,
        borderColor: Palette.darkOrange,
        borderRadius: 25.0,
        elevation: 100.0,
    },
    modalButton: {
        alignSelf: 'center',
        marginVertical: 20.0,
    },
    modalAnimation: {
        position: 'relative',
        width: '80%',
    }
});
