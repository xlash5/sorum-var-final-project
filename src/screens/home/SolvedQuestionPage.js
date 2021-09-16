import React, { useState } from 'react';
import { StyleSheet, Text, Modal, View, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { Palette } from '../../theme/Colors';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TextInput, Button, Snackbar, IconButton } from 'react-native-paper';

const SolvedQuestionPage = ({ route }) => {
    const { qData } = route.params;
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState([]);

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
    );
}

export default SolvedQuestionPage;

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
});
