import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Palette } from '../../theme/Colors';
import firestore from '@react-native-firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Avatar } from 'react-native-paper';

const Leaderboard = () => {
    const leadersRef = firestore().collection('Users');
    const query = leadersRef.orderBy('points', 'desc').limit(10);
    const [leaderData] = useCollectionData(query, { idField: 'id' });

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%', }}>
                <View style={styles.header}>
                    <Text style={styles.cardText}>Resim</Text>
                    <View style={styles.headerLine}></View>
                    <Text style={styles.cardText}>Sırası</Text>
                    <View style={styles.headerLine}></View>
                    <Text style={styles.cardText}>Kullanıcı Adı</Text>
                    <View style={styles.headerLine}></View>
                    <Text style={styles.cardText}>Puan</Text>
                </View>
                {leaderData && leaderData.map((e, index) => {
                    return (
                        <View style={styles.userCard} key={e.id}>
                            {e.image ?
                                <Avatar.Image
                                    style={styles.image}
                                    size={50}
                                    source={{ uri: e.image }} /> :
                                <Avatar.Text
                                    style={styles.image}
                                    size={50}
                                    label={e.name.substring(0, 2)} />}
                            <View style={styles.verticleLine}></View>
                            <Text style={styles.cardText}>{index + 1}</Text>
                            <View style={styles.verticleLine}></View>
                            <Text style={styles.cardText}>{e.userName}</Text>
                            <View style={styles.verticleLine}></View>
                            <Text style={styles.cardText}>{e.points}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        </View >
    )
}

export default Leaderboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: Palette.darkOrange,
        borderWidth: 5.0,
        borderColor: Palette.orange,
        width: '95%',
        elevation: 20,
        borderRadius: 20.0,
        padding: 15.0,
        marginVertical: 20.0,
        alignSelf: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    userCard: {
        flexDirection: 'row',
        backgroundColor: Palette.orange,
        borderWidth: 5.0,
        borderColor: Palette.darkOrange,
        width: '90%',
        borderRadius: 20.0,
        marginVertical: 2.0,
        alignSelf: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15.0,
        paddingVertical: 5.0,
        alignItems: 'center',
    },
    cardText: {
        fontSize: 18.0,
        fontWeight: 'bold',
        color: Palette.dark,
    },
    verticleLine: {
        height: '100%',
        width: 4,
        backgroundColor: Palette.darkOrange,
    },
    headerLine: {
        height: '100%',
        width: 4,
        backgroundColor: Palette.orange,
    },
    image: {
        backgroundColor: Palette.secondary,
    },
});
