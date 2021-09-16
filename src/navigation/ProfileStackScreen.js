import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { tabbarHeaderOptions } from '../theme/Constans';

import Profile from '../screens/home/Profile';
import ProfileEdit from '../screens/home/ProfileEdit';
import MyQuestions from '../screens/home/MyQuestions';
import MyQuestion from '../screens/home/MyQuestion';

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator >
            <ProfileStack.Screen
                name="Profilim"
                component={Profile}
                options={tabbarHeaderOptions}
            />
            <ProfileStack.Screen
                name="Profil Düzenle"
                component={ProfileEdit}
                options={tabbarHeaderOptions}
            />
            <ProfileStack.Screen
                name="Sorularım"
                component={MyQuestions}
                options={tabbarHeaderOptions}
            />
            <ProfileStack.Screen
                name="Sorum"
                component={MyQuestion}
                options={tabbarHeaderOptions}
            />
        </ProfileStack.Navigator >
    );
}