import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TextInput, Button, Avatar, Snackbar } from 'react-native-paper';
import { Palette } from '../../theme/Colors';
import LottieView from 'lottie-react-native';
import { stats, lectures } from '../../theme/Constans';
import { Picker } from 'react-native-woodpicker'

const Home = ({ navigation }) => {
    const [pickedStatus, setPickedStatus] = useState();
    const [lecture, setLecture] = useState();

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <LottieView
                    source={require('../../assets/lottie/students.json')}
                    autoPlay
                    loop
                    style={styles.animationContainer} />
                <View style={{ height: 50.0 }}></View>
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
                        navigation.navigate('Sorular', {
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
            </ScrollView>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    scrollView: {
        width: '100%',
    },
    animationContainer: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        position: 'relative',
        marginTop: 10.0,
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
        marginHorizontal: 80.0,
    }
});
