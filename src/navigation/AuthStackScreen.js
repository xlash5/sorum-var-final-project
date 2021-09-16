import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { defaultHeaderOptions } from '../theme/Constans';
import { NavigationContainer } from '@react-navigation/native';

import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import ForgotPassword from '../screens/auth/ForgotPassword';

const AuthStack = createNativeStackNavigator();

export default function AuthStackScreen() {
    return (
        <NavigationContainer>
            <AuthStack.Navigator>
                <AuthStack.Screen
                    name="Giriş"
                    component={Login}
                    options={defaultHeaderOptions}
                />
                <AuthStack.Screen
                    name="Üye Ol"
                    component={SignUp}
                    options={defaultHeaderOptions}
                />
                <AuthStack.Screen
                    name="Şifremi Unuttum"
                    component={ForgotPassword}
                    options={defaultHeaderOptions}
                />
            </AuthStack.Navigator>
        </NavigationContainer>
    );
}