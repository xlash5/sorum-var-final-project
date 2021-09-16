import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
import { Palette } from '../../theme/Colors';
import firestore from '@react-native-firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import QuestionCard from '../../components/QuestionCard';
import SolvedQuestionCard from '../../components/SolvedQuestionCard';

const MyQuestions = ({ navigation }) => {
    const questionsRef = firestore().collection('Questions');
    const query = questionsRef.where('askedBy', '==', auth().currentUser.uid);
    const [questions] = useCollectionData(query, { idField: 'id' });

    const renderCard = ({ item }) => (
        <TouchableHighlight
            onPress={() => {
                navigation.navigate('Sorum', {
                    qData: item,
                })
            }}
            underlayColor={Palette.secondary}>
            {item.solved ? <SolvedQuestionCard item={item} /> : <QuestionCard item={item} />}
        </TouchableHighlight>
    );

    return (
        <View style={styles.container}>
            {questions && <FlatList
                style={{ width: '100%' }}
                data={questions.sort((a, b) => b.date - a.date)}
                renderItem={renderCard}
                keyExtractor={item => item.id}
            />}
        </View>
    );
}

export default MyQuestions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Palette.primary,
    },
});
