import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { TextInput, Button, Caption, Snackbar } from 'react-native-paper';
import { Palette } from '../../theme/Colors';

const Login = ({ navigation }) => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState(false);

    const onDismissSnackBar = () => setErr(false);

    const logIn = () => {
        try {
            if (!mail && !password) {
                setErr(true);
                return;
            }
            auth().signInWithEmailAndPassword(mail, password)
                .then(() => {
                    console.log('Login successful');
                }).catch(() => {
                    setErr(true);
                });
        } catch (e) {
            console.log('Login failed');
            setErr(true);
        }
    };

    return (
        <View style={styles.container}>
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
            <Button
                mode="contained"
                onPress={logIn}
                style={styles.button}
                color={Palette.secondary}
            >
                Giriş
            </Button>
            <View style={{ height: 20.0 }}></View>
            <View style={styles.textContainer}>
                <Text>
                    Yeni hesap oluşturmak için
                    <Text style={{ color: Palette.darkOrange }} onPress={() => {
                        navigation.navigate('Üye Ol')
                    }}> buraya </Text>
                    basın
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text>
                    Şifrenizi unuttuysanız
                    <Text style={{ color: Palette.darkOrange }} onPress={() => {
                        navigation.navigate('Şifremi Unuttum')
                    }}> buraya </Text>
                    basın
                </Text>
            </View>
            <Snackbar
                visible={err}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Close',
                    onPress: onDismissSnackBar,
                }}>
                Something went wrong.
            </Snackbar>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Palette.primary,
    },
    input: {
        marginHorizontal: 50.0,
        marginVertical: 10.0,
    },
    button: {
        marginHorizontal: 80.0,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 10.0,
    }
})
