import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { tabbarHeaderOptions } from '../theme/Constans';

import Home from '../screens/home/Home';
import Questions from '../screens/home/Questions';
import QuestionPage from '../screens/home/QuestionPage';
const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator >
            <HomeStack.Screen
                name="Ana Menü"
                component={Home}
                options={tabbarHeaderOptions}
            />
            <HomeStack.Screen
                name="Sorular"
                component={Questions}
                options={tabbarHeaderOptions}
            />
            <HomeStack.Screen
                name="Soru"
                component={QuestionPage}
                options={tabbarHeaderOptions}
            />
        </HomeStack.Navigator >
    );
}