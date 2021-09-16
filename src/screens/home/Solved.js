import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TextInput, Button, Avatar, Snackbar } from 'react-native-paper';
import { Palette } from '../../theme/Colors';
import LottieView from 'lottie-react-native';
import { solvedStats, lectures, stats } from '../../theme/Constans';
import { Picker } from 'react-native-woodpicker'

const Solved = ({ navigation }) => {
    const [pickedStatus, setPickedStatus] = useState();
    const [lecture, setLecture] = useState();

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/lottie/solved.json')}
                autoPlay
                loop={true}
                style={styles.animationContainer} />
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
            <Button
                mode="contained"
                onPress={() => {
                    navigation.navigate('Çözülmüş Sorular', {
                        pickedStatus: pickedStatus,
                        lecture: lecture,
                    });
                }}
                style={styles.button}
                disabled={
                    (pickedStatus && lecture ? false : true)
                }
                color={Palette.secondary}
            >
                Listele
            </Button>
        </View>
    );
}

export default Solved;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    animationContainer: {
        width: '75%',
        alignSelf: 'center',
        position: 'relative',
    },
    status: {
        height: 40.0,
        paddingHorizontal: 20.0,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15.0,
        borderWidth: 1.0,
        borderColor: Palette.dark,
        backgroundColor: Palette.orange,
    },
});
