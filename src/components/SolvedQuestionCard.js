import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '../theme/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const SolvedQuestionCard = ({ item }) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

    const getDate = (time) => {
        let timeData = new Date();
        timeData.setTime(time);

        return days[timeData.getDay()] + ' ' + timeData.getHours() + ':' + timeData.getMinutes() + ':' + timeData.getSeconds();
    }

    return (
        <View style={styles.card}>
            <View style={styles.solvedTextContainer}>
                <Text style={styles.solvedText}>Çözülmüş</Text>
                <Icon name='check-circle-o' size={24} color={Palette.dark} style={styles.solvedIcon} />
            </View>
            <View style={styles.cardTopRow}>
                <Text style={styles.topText}>{item.title}</Text>
                <View style={{ width: 8.0 }}></View>
                <Text style={styles.topDate}>{getDate(item.date)}</Text>
            </View>
            <View style={styles.cardBottom}>
                <Text style={styles.context}>{item.context.length <= 110 ? item.context : item.context.substring(0, 110) + '...'}</Text>
            </View>
        </View>
    )
}

export default SolvedQuestionCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: Palette.orange,
        borderWidth: 1.0,
        borderColor: Palette.darkOrange,
        height: 140.0,
        width: '90%',
        borderRadius: 20.0,
        padding: 15.0,
        marginVertical: 4.0,
        alignSelf: 'center',
        flexWrap: 'wrap',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    topText: {
        flex: 3,
        fontSize: 16,
        fontWeight: '700',
        color: Palette.dark,
    },
    topDate: {
        flex: 2,
        fontSize: 16,
        fontWeight: '700',
        color: Palette.dark,
    },
    context: {
        fontSize: 16,
        fontWeight: '500',
        color: Palette.dark,
    },
    solvedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Palette.dark,
        marginRight: 10.0,
    },
    solvedTextContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
    },
    solvedIcon: {
        color: Palette.secondary,
    }
});