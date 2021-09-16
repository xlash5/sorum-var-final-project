import React, { useState } from 'react';
import { StyleSheet, Text, Modal, View, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { Palette } from '../../theme/Colors';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TextInput, Button, Snackbar, IconButton } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';

const MyQuestion = ({ route, navigation }) => {
    const { qData } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState([]);
    const [success, setSuccess] = useState(false);

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
        }, 1800);
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

    if (qData.solved) {
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: '100%' }}>
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
                        <View >
                            {qData.answeredBy.map((e, index) => {
                                return (
                                    <View style={styles.answerCard} key={index + e.imageUrl}>
                                        <Text style={styles.boldTextHeader}>Doğru Cevap</Text>
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
                    </ScrollView>
                    <MyModal />
                </View>
            </View>
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
        <View style={notSolvedStyle.container}>
            <View style={{ width: '100%', height: '100%' }}>
                <ScrollView>
                    <View style={notSolvedStyle.card}>
                        <Text style={{ ...notSolvedStyle.boldText, alignSelf: 'center', fontSize: 20.0 }}>Soru</Text>
                        <Text style={notSolvedStyle.boldText}>Konu: <Text style={notSolvedStyle.normalText}>{qData.title}</Text></Text>
                        <Text style={notSolvedStyle.boldText}>Soru: <Text style={notSolvedStyle.normalText}>{qData.context}</Text></Text>
                        <View style={notSolvedStyle.line}></View>
                        <Text style={notSolvedStyle.boldText}>Soru Eklentisi: </Text>
                        {
                            qData.image ?
                                <TouchableWithoutFeedback onPress={() => modalActive(qData.image)}>
                                    <Image
                                        style={notSolvedStyle.image}
                                        source={{ uri: qData.image }}
                                    />
                                </TouchableWithoutFeedback>
                                :
                                <Text style={notSolvedStyle.normalText}>Resim Yok</Text>
                        }
                    </View>
                    <View style={notSolvedStyle.line}></View>
                    <ItsMine />
                </ScrollView>
            </View>
            <MyModal />
        </View >
    )
}

export default MyQuestion

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
    boldText: {
        fontSize: 16.0,
        fontWeight: 'bold',
        flexWrap: 'wrap',
    },
    boldTextHeader: {
        fontSize: 18.0,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        textAlign: 'center',
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
    answerCard: {
        backgroundColor: Palette.orange,
        borderWidth: 1.0,
        borderColor: Palette.darkOrange,
        width: '90%',
        borderRadius: 20.0,
        padding: 15.0,
        marginVertical: 4.0,
        alignSelf: 'center',
    },
    line: {
        borderTopWidth: 2.0,
        width: '100%',
        borderTopColor: Palette.darkOrange,
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: 10.0,
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
})

const notSolvedStyle = StyleSheet.create({
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
})