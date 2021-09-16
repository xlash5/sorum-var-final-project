import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Palette } from '../../theme/Colors';
import auth from '@react-native-firebase/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import { Surface, Avatar, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const Profile = ({ navigation }) => {
    const userDoc = firestore().collection('Users').doc(auth().currentUser.uid);
    const [userData] = useDocumentData(userDoc);

    const renderProfile = () => {
        return (
            <ScrollView style={{ alignSelf: 'stretch' }}>
                <Surface style={styles.topContainer}>
                    {userData.image ?
                        <Avatar.Image
                            style={styles.image}
                            size={150}
                            source={{ uri: userData.image }} /> :
                        <Avatar.Text
                            style={styles.image}
                            size={150}
                            label={userData.name.substring(0, 2)} />}
                    <View style={styles.nameContainer}>
                        <View style={styles.box}>
                            <Text style={styles.text}>Kullanıcı Adı:</Text>
                            <Text style={styles.text}>{userData.userName}</Text>
                        </View>
                        <View style={styles.empty}></View>
                        <View style={styles.box}>
                            <Text style={styles.text}>Ad Soyad:</Text>
                            <Text style={styles.text}>{userData.name + ' ' + userData.surname}</Text>
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <View style={styles.box}>
                            <Text style={styles.text}>Öğrenim Durumu:</Text>
                            <Text style={styles.text}>{userData.status == 5 ? "Mezun" : userData.status}</Text>
                        </View>
                        <View style={styles.empty}></View>
                        <View style={styles.box}>
                            <Text style={styles.text}>Puan Durumu:</Text>
                            <Text style={styles.text}>{userData.points}</Text>
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <View style={styles.box}>
                            <Text style={styles.text}>Sorulan Soru Sayısı:</Text>
                            <Text style={styles.text}>{userData.asked}</Text>
                        </View>
                        <View style={styles.empty}></View>
                        <View style={styles.box}>
                            <Text style={styles.text}>Çözülen Soru Sayısı:</Text>
                            <Text style={styles.text}>{userData.solved}</Text>
                        </View>
                    </View>
                </Surface>
                <Button
                    mode="contained"
                    onPress={() => {
                        navigation.navigate('Profil Düzenle');
                    }}
                    style={styles.button}
                    color={Palette.secondary}
                >
                    Profil Düzenle
                </Button>
                <Button
                    mode="contained"
                    onPress={() => {
                        navigation.navigate('Sorularım');
                    }}
                    style={styles.button}
                    color={Palette.secondary}
                >
                    Sorularım
                </Button>
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>
            {userData ?
                renderProfile()
                :
                <LottieView
                    source={require('../../assets/lottie/loading.json')}
                    autoPlay
                    loop
                    style={{ backgroundColor: Palette.primary }} />
            }
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    topContainer: {
        alignSelf: 'stretch',
        backgroundColor: Palette.primary,
        padding: 10.0,
        marginTop: 60.0,
        marginHorizontal: 25.0,
        paddingBottom: 20.0,
        alignItems: 'center',
        elevation: 20,
        borderRadius: 20.0,
    },
    image: {
        marginTop: -60,
        backgroundColor: Palette.secondary,
    },
    nameContainer: {
        flexDirection: 'row',
        marginTop: 20.0
    },
    box: {
        flex: 0.49,
        alignItems: 'center',
        borderRadius: 10.0,
        backgroundColor: Palette.orange,
        borderWidth: 1.0,
        borderColor: Palette.darkOrange,
        padding: 5.0,
    },
    empty: {
        flex: 0.02,
    },
    text: {
        fontSize: 16.0,
        fontWeight: '700',
        textAlign: 'center',
    },
    button: {
        marginHorizontal: 100.0,
        marginTop: 20.0,
    }
});
