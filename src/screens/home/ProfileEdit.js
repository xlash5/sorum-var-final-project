import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Avatar, Snackbar } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import firestore from '@react-native-firebase/firestore';
import { Palette } from '../../theme/Colors';
import { Picker } from 'react-native-woodpicker'
import { launchImageLibrary } from 'react-native-image-picker';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import { stats } from '../../theme/Constans';

const ProfileEdit = ({ navigation }) => {
    const userDoc = firestore().collection('Users').doc(auth().currentUser.uid);
    const [userData] = useDocumentDataOnce(userDoc);

    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [pickedStatus, setPickedStatus] = useState();
    const [image, setImage] = useState('');
    const [success, setSuccess] = useState(false);
    const [imageSelected, setImageSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setUserName(userData.userName);
            setName(userData.name);
            setSurname(userData.surname);
            setImage(userData.image);
        }
    }, [userData]);


    const imageOnPress = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                console.log(response.assets[0].uri);
                console.log(utils.FilePath.PICTURES_DIRECTORY);
                setImage(response.assets[0].uri);
                setImageSelected(true);
            }
        });
    }

    const updateUserData = async () => {
        setLoading(true);
        if (imageSelected) {
            let reference = storage().ref(`${auth().currentUser.uid}/profile.png`);
            let task = reference.putFile(image);

            await task.then((t) => {
                setLoading(false);
                console.log('Image uploaded to the bucket!');
            }).catch((e) => console.log('uploading image error => ', e));

            reference.getDownloadURL()
                .then((url) => {
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.uid)
                        .update({
                            name: name,
                            surname: surname,
                            status: pickedStatus.value,
                            image: url,
                            userName: userName,
                        })
                        .then(() => {
                            setSuccess(true);
                            setTimeout(() => {
                                navigation.pop();
                            }, 1800)
                            console.log('User updated!');
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }).catch((e) => { console.log(e) })
        } else {
            firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .update({
                    name: name,
                    surname: surname,
                    status: pickedStatus.value,
                    image: image,
                    userName: userName,
                })
                .then(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        navigation.pop();
                    }, 1800)
                    console.log('User updated!');
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const renderScreen = () => {
        if (success) {
            return (
                <LottieView
                    source={require('../../assets/lottie/success.json')}
                    autoPlay
                    loop={false}
                    style={{ backgroundColor: Palette.primary }} />
            )
        }


        return (
            <ScrollView>
                <View style={{ height: 20.0 }}></View>
                <TouchableOpacity onPress={imageOnPress}>
                    <Avatar.Image
                        style={styles.image}
                        size={150}
                        source={image ? { uri: image } : require('../../assets/icons/camera.png')} />
                </TouchableOpacity>
                <TextInput
                    label="Kullanıcı Adı"
                    value={userName}
                    style={styles.input}
                    onChangeText={e => setUserName(e)}
                />
                <TextInput
                    label="İsim"
                    value={name}
                    style={styles.input}
                    onChangeText={e => setName(e)}
                />
                <TextInput
                    label="Soyad"
                    value={surname}
                    style={styles.input}
                    onChangeText={e => setSurname(e)}
                />
                <Picker
                    item={pickedStatus}
                    items={stats}
                    onItemChange={setPickedStatus}
                    title="Öğretim Durumunu Seçiniz"
                    placeholder="Öğretim Durumunu Seçiniz"
                    backdropAnimation={{ opacity: 0 }}
                    mode="dropdown"
                    containerStyle={styles.status}
                //isNullable
                //disable
                />
                <View style={styles.buttonRow}>
                    <Button
                        mode="contained"
                        onPress={updateUserData}
                        style={styles.button}
                        disabled={
                            (pickedStatus && name && surname && image && userName ? false : true)
                        }
                        color={Palette.secondary}
                    >
                        Kaydet
                    </Button>
                </View>
                <View style={{ height: 20.0 }}></View>
            </ScrollView>
        );
    }

    if (loading) {
        return (
            <LottieView
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                loop
                style={{ backgroundColor: Palette.primary }} />
        )
    }

    return (
        <View style={styles.container}>
            {userData ?
                renderScreen()
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

export default ProfileEdit;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.primary,
    },
    input: {
        marginHorizontal: 50.0,
        marginVertical: 8.0,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    status: {
        margin: 0.0,
        height: 40.0,
        alignSelf: 'center',
        marginBottom: 15.0,
        borderWidth: 1.0,
        borderColor: Palette.dark,
        backgroundColor: Palette.orange,
        paddingHorizontal: 20.0,
    },
    image: {
        alignSelf: 'center',
        marginBottom: 15.0,
        backgroundColor: Palette.secondary,
    }
});
