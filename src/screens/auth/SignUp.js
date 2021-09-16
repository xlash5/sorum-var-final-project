import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Caption, Avatar, Snackbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Palette } from '../../theme/Colors';
import { stats } from '../../theme/Constans';

import { Picker } from 'react-native-woodpicker'

const SignUp = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [pickedStatus, setPickedStatus] = useState();
    const [err, setErr] = useState(false);

    const onDismissSnackBar = () => setErr(false);


    const buttonSignUp = async () => {
        if ((password === repeatPassword) && userName) {
            auth().createUserWithEmailAndPassword(mail, password).then(data => {
                firestore()
                    .collection('Notifications')
                    .doc(data.user.uid)
                    .set({
                        hasNotification: false,
                    })
                    .then(() => {
                        console.log('Notifications added!');
                    })
                    .catch(e => {
                        console.log(e);
                    });
                firestore()
                    .collection('Users')
                    .doc(data.user.uid)
                    .set({
                        userName: userName,
                        name: name,
                        surname: surname,
                        status: pickedStatus.value,
                        points: 0,
                        image: '',
                        solved: 0,
                        asked: 0,
                    })
                    .then(() => {
                        console.log('User added!');
                    })
                    .catch(e => {
                        console.log(e);
                        setErr(true);
                    });
            });

        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: 20.0 }}></View>
                <TextInput
                    label="Kullanıcı Adı"
                    style={styles.input}
                    onChangeText={e => setUserName(e)}
                />
                <TextInput
                    label="İsim"
                    style={styles.input}
                    onChangeText={e => setName(e)}
                />
                <TextInput
                    label="Soyad"
                    style={styles.input}
                    onChangeText={e => setSurname(e)}
                />
                <TextInput
                    label="Email"
                    style={styles.input}
                    onChangeText={e => setMail(e)}
                />
                <TextInput
                    label="Şifre"
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={e => setPassword(e)}
                />
                <TextInput
                    label="Şifre Tekrar"
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={e => setRepeatPassword(e)}
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
                        onPress={buttonSignUp}
                        style={styles.button}
                        disabled={
                            (userName && repeatPassword && password && pickedStatus && name && surname && mail ? false : true)
                        }
                        color={Palette.secondary}
                    >
                        Sign Up
                    </Button>
                </View>
                <View style={{ height: 20.0 }}></View>
                <Snackbar
                    visible={err}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Close',
                        onPress: onDismissSnackBar,
                    }}>
                    Something went wrong.
                </Snackbar>
            </ScrollView>
        </View>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Palette.primary,
    },
    input: {
        marginHorizontal: 50.0,
        marginVertical: 8.0,
    },
    button: {

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
    }
})
