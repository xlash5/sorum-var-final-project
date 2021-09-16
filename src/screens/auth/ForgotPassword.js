import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '../../theme/Colors';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { TextInput, Button, Caption, Snackbar } from 'react-native-paper';

const ForgotPassword = ({ navigation }) => {
    const [success, setSuccess] = useState(false);
    const [mail, setMail] = useState('');
    const [err, setErr] = useState(false);

    const onDismissSnackBar = () => setErr(false);

    const sendResetReq = () => {
        if (mail) {
            setSuccess(true);
            auth().sendPasswordResetEmail(mail)
                .then(e => {
                    setTimeout(() => {
                        navigation.popToTop();
                    }, 1800);
                })
                .catch(e => { console.log(e) });
        } else {
            setErr(true);
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

    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                style={styles.input}
                onChangeText={e => setMail(e)}
            />
            <Button
                mode="contained"
                onPress={sendResetReq}
                style={styles.button}
                color={Palette.secondary}
            >
                Şifremi Sıfırla
            </Button>
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

export default ForgotPassword;

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
});
