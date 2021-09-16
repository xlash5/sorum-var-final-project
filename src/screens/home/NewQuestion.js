import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, SafeAreaView } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { Palette } from '../../theme/Colors';
import { Picker } from 'react-native-woodpicker'
import { stats, lectures } from '../../theme/Constans';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

const NewQuestion = () => {
    const userDoc = firestore().collection('Users').doc(auth().currentUser.uid);
    const [userData] = useDocumentDataOnce(userDoc);

    const [pickedStatus, setPickedStatus] = useState();
    const [lecture, setLecture] = useState();
    const [title, setTitle] = useState();
    const [context, setContext] = useState();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [image, setImage] = useState('');

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
                setImage(response.assets[0]);
                console.log(image);
            }
        });
    }

    const onAsk = async () => {
        if (!userData) { return }

        setLoading(true);
        if (image) {
            let reference = storage().ref(`questions/${auth().currentUser.uid}/${image.fileName}`);
            let task = reference.putFile(image.uri);

            await task.then((t) => {
                console.log('Image uploaded to the bucket!');
                setLoading(false);
                setSuccess(true);
            }).catch((e) => console.log('uploading image error => ', e));

            reference.getDownloadURL()
                .then((url) => {
                    firestore()
                        .collection('Questions')
                        .add({
                            status: pickedStatus.value,
                            lecture: lecture.value,
                            title: title,
                            context: context,
                            askedBy: auth().currentUser.uid,
                            answeredBy: [],
                            image: url,
                            date: Date.now(),
                            solved: false,
                        })
                        .then(() => {
                            firestore()
                                .collection('Users')
                                .doc(auth().currentUser.uid)
                                .update({
                                    asked: userData.asked + 1,
                                    points: userData.points + 1,
                                })
                                .then(() => {
                                    console.log('User updated!');
                                })
                                .catch(e => {
                                    console.log(e);
                                });

                            setTimeout(() => {
                                setPickedStatus();
                                setLecture();
                                setTitle();
                                setContext();
                                setLoading(false);
                                setImage('');
                                setSuccess(false);
                            }, 1800);
                            console.log('Question added!');
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }).catch((e) => { console.log(e) })
        } else {
            setLoading(false);
            setSuccess(true);
            firestore()
                .collection('Questions')
                .add({
                    status: pickedStatus.value,
                    lecture: lecture.value,
                    title: title,
                    context: context,
                    askedBy: auth().currentUser.uid,
                    answeredBy: [],
                    image: '',
                    date: Date.now(),
                    solved: false,
                })
                .then(() => {
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.uid)
                        .update({
                            asked: userData.asked + 1,
                            points: userData.points + 1,
                        })
                        .then(() => {
                            console.log('User updated!');
                        })
                        .catch(e => {
                            console.log(e);
                        });

                    setTimeout(() => {
                        setPickedStatus();
                        setLecture();
                        setTitle();
                        setContext();
                        setLoading(false);
                        setImage('');
                        setSuccess(false);
                    }, 1800);
                    console.log('Question added!');
                })
                .catch(e => {
                    console.log(e);
                });
        }

    }

    if (success) {
        return (
            <LottieView
                source={require('../../assets/lottie/success.json')}
                autoPlay
                loop={false}
                style={{ backgroundColor: Palette.primary }} />
        )
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
            <ScrollView>
                <View style={{ height: 20.0 }}></View>
                <Picker
                    item={pickedStatus}
                    items={stats.filter(e => e.value !== 5)}
                    onItemChange={setPickedStatus}
                    title="Sınıf"
                    placeholder="Sınıf"
                    backdropAnimation={{ opacity: 0 }}
                    mode="dropdown"
                    containerStyle={styles.status}
                //isNullable
                //disable
                />
                <Picker
                    item={lecture}
                    items={lectures}
                    onItemChange={setLecture}
                    title="Ders"
                    placeholder="Ders"
                    backdropAnimation={{ opacity: 0 }}
                    mode="dropdown"
                    containerStyle={styles.status}
                //isNullable
                //disable
                />
                <TextInput
                    label="Konu"
                    value={title}
                    style={styles.input}
                    onChangeText={setTitle}
                />
                <TextInput
                    label="Açıklama yazınız..."
                    value={context}
                    style={styles.input}
                    onChangeText={setContext}
                    multiline={true}
                    numberOfLines={10}
                />
                <Button icon="paperclip"
                    mode="contained"
                    onPress={imageOnPress}
                    style={styles.button}>
                    Resim ekle!
                </Button>
                <View style={{ height: 20.0 }}></View>
                <Button
                    mode="contained"
                    onPress={onAsk}
                    style={styles.button}
                    disabled={
                        (pickedStatus && title && lecture ? false : true)
                    }
                    color={Palette.secondary}
                >
                    SOR!
                </Button>
                {image === '' ? null :
                    <Image
                        style={styles.image}
                        source={{ uri: image.uri }}
                    />
                }
                <View style={{ height: 20.0 }}></View>
            </ScrollView>
        </View>
    )
}

export default NewQuestion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    container: {
        flex: 1,
        backgroundColor: Palette.primary,
    },
    input: {
        marginHorizontal: 50.0,
        marginVertical: 8.0,
    },
    status: {
        margin: 0.0,
        height: 40.0,
        paddingHorizontal: 20.0,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15.0,
        borderWidth: 1.0,
        borderColor: Palette.dark,
        backgroundColor: Palette.orange,
    },
    button: {
        marginHorizontal: 100.0,
    },
    image: {
        height: 250,
        width: '80%',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: 20.0,
    }
});
