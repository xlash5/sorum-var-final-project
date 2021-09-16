import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Palette } from '../../theme/Colors';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TextInput, Button, Snackbar, IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

const QuestionPage = ({ route, navigation }) => {
    const { qData } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [answer, setAnswer] = useState('');
    const [modalImage, setModalImage] = useState([]);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const answerQuestion = async () => {
        setLoading(true);
        if (image !== '') {
            let reference = storage().ref(`answers/${qData.id}/${auth().currentUser.uid}/${Date.now()}.png`);
            let task = reference.putFile(image);

            await task.then((t) => {
                setLoading(false);
                console.log('Image uploaded to the bucket!');
            }).catch((e) => console.log('uploading image error => ', e));

            firestore()
                .collection('Notifications')
                .doc(qData.askedBy)
                .update({
                    hasNotification: true,
                })
                .then(() => {
                    console.log('Notification send');
                })
                .catch(e => {
                    console.log(e);
                });

            reference.getDownloadURL()
                .then((url) => {
                    firestore()
                        .collection('Questions')
                        .doc(qData.id)
                        .update({
                            answeredBy: [...qData.answeredBy, {
                                answer: answer,
                                imageUrl: url,
                                answeredId: auth().currentUser.uid,
                            }],
                        })
                        .then(() => {
                            setSuccess(true);
                            setTimeout(() => {
                                navigation.popToTop();
                            }, 1800)
                            console.log('Question answered!');
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }).catch((e) => { console.log(e) })
        } else {
            setLoading(false);
            setSuccess(true);
            firestore()
                .collection('Notifications')
                .doc(qData.askedBy)
                .update({
                    hasNotification: true,
                })
                .then(() => {
                    console.log('Notification send');
                })
                .catch(e => {
                    console.log(e);
                });

            firestore()
                .collection('Questions')
                .doc(qData.id)
                .update({
                    answeredBy: [...qData.answeredBy, {
                        answer: answer,
                        imageUrl: '',
                        answeredId: auth().currentUser.uid,
                    }]
                })
                .then(() => {
                    setTimeout(() => {
                        navigation.popToTop();
                    }, 1800)
                    console.log('Question answered!');
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    const selectImage = () => {
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
            }
        });
    }


    const MyModal = () => {
        return (
            <Modal visible={showModal} transparent={true}>
                <View style={styles.modal} >
                    <ImageViewer imageUrls={modalImage} />
                    <Button
                        mode="contained"
                        onPress={() => setShowModal(!showModal)}
                        style={styles.modalButton}
                        color={Palette.darkOrange}
                    >
                        KAPAT
                    </Button>
                </View>
            </Modal>
        );
    }

    const modalActive = (imageUrl) => {
        setModalImage([{
            url: imageUrl,
            props: {
                // Or you can set source directory.
            }
        }]);
        setShowModal(true);
    }

    const submitTrueAnswer = async (userId) => {
        setSuccess(true);

        await firestore()
            .collection('Users')
            .doc(userId)
            .get().then((documentSnapshot) => {
                firestore()
                    .collection('Users')
                    .doc(userId)
                    .update({
                        points: documentSnapshot.data().points + 5,
                        solved: documentSnapshot.data().solved + 1,
                    })
                    .then(() => {
                        console.log('Points added');
                    })
                    .catch(e => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });

        await firestore()
            .collection('Questions')
            .doc(qData.id)
            .update({
                solved: true,
                answeredBy: qData.answeredBy.filter(e => e.answeredId === userId),
            })
            .then(() => {
                console.log('Question solved');
            })
            .catch(e => {
                console.log(e);
            });

        await setTimeout(() => {
            navigation.popToTop();
        }, 1800)
    }

    const ItsMine = () => {
        if (qData.answeredBy.length === 0) {
            return (
                <View style={styles.card}>
                    <Text style={styles.boldText}>Henüz cevaplanmamış...</Text>
                </View>
            )
        }

        return (
            <View >
                {qData.answeredBy.map((e, index) => {
                    return (
                        <View style={styles.card} key={index + e.imageUrl}>
                            <Text style={styles.boldText}>Cevap: <Text style={styles.normalText}>{e.answer}</Text></Text>
                            <Text style={styles.boldText}>Resim: </Text>
                            {
                                e.imageUrl ? <TouchableWithoutFeedback onPress={() => { modalActive(e.imageUrl) }}>
                                    <Image
                                        style={styles.cardImage}
                                        source={{ uri: e.imageUrl }}
                                    />
                                </TouchableWithoutFeedback> :
                                    <Text style={styles.normalText}>Resim Yok</Text>
                            }
                            <Button icon="thumb-up"
                                mode="contained"
                                onPress={() => submitTrueAnswer(e.answeredId)}
                                style={styles.submitTrueButton}>
                                Doğru Cevap
                            </Button>
                        </View>
                    )
                })}
            </View>
        );
    }

    const NotMine = () => {
        if (qData.answeredBy.length === 0) {
            return (
                <View style={styles.card}>
                    <Text style={styles.boldText}>Henüz cevaplanmamış...</Text>
                </View>
            )
        }
        return (
            <View>
                {qData.answeredBy.map((e, index) => {
                    return (
                        <View style={styles.card} key={e.imageUrl + index}>
                            <Text style={styles.boldText}>Cevap: <Text style={styles.normalText}>{e.answer}</Text></Text>
                            <Text style={styles.boldText}>Resim: </Text>
                            {
                                e.imageUrl ? <TouchableWithoutFeedback onPress={() => { modalActive(e.imageUrl) }}>
                                    <Image
                                        style={styles.cardImage}
                                        source={{ uri: e.imageUrl }}
                                    />
                                </TouchableWithoutFeedback> :
                                    <Text style={styles.normalText}>Resim Yok</Text>
                            }
                        </View>
                    )
                })}
            </View>
        );
    }


    if (loading) {
        return (
            <LottieView
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                loop={true}
                style={{ backgroundColor: Palette.primary }} />
        )
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

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', height: auth().currentUser.uid === qData.askedBy ? '100%' : '70%' }}>
                <ScrollView>
                    <View style={styles.card}>
                        <Text style={{ ...styles.boldText, alignSelf: 'center', fontSize: 20.0 }}>Soru</Text>
                        <Text style={styles.boldText}>Konu: <Text style={styles.normalText}>{qData.title}</Text></Text>
                        <Text style={styles.boldText}>Soru: <Text style={styles.normalText}>{qData.context}</Text></Text>
                        <View style={styles.line}></View>
                        <Text style={styles.boldText}>Soru Eklentisi: </Text>
                        {
                            qData.image ?
                                <TouchableWithoutFeedback onPress={() => modalActive(qData.image)}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: qData.image }}
                                    />
                                </TouchableWithoutFeedback>
                                :
                                <Text style={styles.normalText}>Resim Yok</Text>
                        }
                    </View>
                    <View style={styles.line}></View>
                    {
                        auth().currentUser.uid === qData.askedBy ?
                            <ItsMine />
                            :
                            <NotMine />
                    }
                </ScrollView>
            </View>
            {
                auth().currentUser.uid !== qData.askedBy &&
                <View style={styles.bottomContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Cevabınız..."
                            value={answer}
                            style={styles.input}
                            onChangeText={setAnswer}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <View style={{ height: 5.0 }}></View>
                        <View style={{ flexDirection: 'row' }}>
                            <Button icon="send"
                                mode="contained"
                                onPress={answerQuestion}
                                style={styles.button}
                                disabled={answer === ''}>
                                Gönder
                            </Button>
                        </View>
                    </View>
                    <View style={styles.buttonColumn}>
                        {image !== '' ?
                            <TouchableWithoutFeedback onPress={() => { modalActive(image) }}>
                                <Image
                                    style={styles.attachedImage}
                                    source={{ uri: image }}
                                />
                            </TouchableWithoutFeedback>
                            : <Text>RESIM EKLENMEDI</Text>}
                        <IconButton
                            icon="paperclip"
                            color={Palette.dark}
                            style={{ backgroundColor: Palette.secondary, alignSelf: 'center' }}
                            size={30}
                            onPress={selectImage}
                        />
                    </View>
                </View>
            }
            <MyModal />
        </View >
    )
}

export default QuestionPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    attachedImage: {
        height: '60%',
        resizeMode: 'contain',
    },
    modal: {
        alignSelf: 'center',
        marginTop: '15%',
        width: '95%',
        flex: 0.92,
    },
    modalButton: {
        width: 100.0,
        height: 40.0,
        alignSelf: 'flex-end',
    },
    boldText: {
        fontSize: 16.0,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    normalText: {
        fontSize: 16.0,
        fontWeight: '600',
        flexWrap: 'wrap',
    },
    card: {
        backgroundColor: Palette.orange,
        borderWidth: 1.0,
        borderColor: Palette.darkOrange,
        width: '90%',
        borderRadius: 20.0,
        padding: 15.0,
        marginVertical: 4.0,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        height: '100%',
        width: '70%',
    },
    button: {
        height: 50,
        width: '90%',
        justifyContent: 'center',
        marginLeft: 5.0,
    },
    buttonColumn: {
        width: '30%',
    },
    bottomContainer: {
        width: '100%',
        height: '30%',
        flexDirection: 'row',
        borderTopWidth: 1.0,
        borderTopColor: Palette.darkOrange,
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: 10.0,
    },
    line: {
        borderTopWidth: 2.0,
        width: '100%',
        borderTopColor: Palette.darkOrange,
    },
    submitTrueButton: {
        marginTop: 10.0,
    }
});
