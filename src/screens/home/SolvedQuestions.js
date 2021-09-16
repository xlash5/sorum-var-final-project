import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { Palette } from '../../theme/Colors';
import firestore from '@react-native-firebase/firestore';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import QuestionCard from '../../components/QuestionCard';

const SolvedQuestions = ({ route, navigation }) => {
    const { pickedStatus, lecture } = route.params;
    const [loading, setLoading] = useState(false);

    const questionsRef = firestore().collection('Questions');
    const query = questionsRef.where('solved', '==', true).where('lecture', '==', lecture.value).where('status', '==', pickedStatus.value);
    const [questions] = useCollectionDataOnce(query, { idField: 'id' });

    const renderCard = ({ item }) => (
        <TouchableHighlight
            onPress={() => {
                navigation.navigate('Çözülmüş Soru', {
                    qData: item,
                })
            }}
            underlayColor={Palette.secondary}>
            <QuestionCard item={item} />
        </TouchableHighlight>
    );

    if (loading) {
        return (
            <LottieView
                source={require('../../assets/lottie/loading.json')}
                autoPlay
                loop
                style={{ backgroundColor: Palette.primary }} />
        )
    }

    return (
        <View style={styles.container}>
            {questions && <FlatList
                style={{ width: '100%' }}
                data={questions.sort((a, b) => b.date - a.date)}
                renderItem={renderCard}
                keyExtractor={item => item.id}
            />}
        </View>
    )
}

export default SolvedQuestions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
});