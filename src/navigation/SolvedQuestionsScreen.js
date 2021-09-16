import React from 'react';
import { Text } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { tabbarHeaderOptions } from '../theme/Constans';

import Solved from '../screens/home/Solved';
import SolvedQuestions from '../screens/home/SolvedQuestions';
import SolvedQuestionPage from '../screens/home/SolvedQuestionPage';

const SolvedQuestionsStack = createNativeStackNavigator();

export default function SolvedQuestionsStackScreen() {
    return (
        <SolvedQuestionsStack.Navigator >
            <SolvedQuestionsStack.Screen
                name="Çözülmüşler"
                component={Solved}
                options={tabbarHeaderOptions}
            />
            <SolvedQuestionsStack.Screen
                name="Çözülmüş Sorular"
                component={SolvedQuestions}
                options={tabbarHeaderOptions}
            />
            <SolvedQuestionsStack.Screen
                name="Çözülmüş Soru"
                component={SolvedQuestionPage}
                options={tabbarHeaderOptions}
            />
        </SolvedQuestionsStack.Navigator >
    );
}