import { Palette } from '../theme/Colors';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import React from 'react';

export const defaultHeaderOptions = { headerStyle: { backgroundColor: Palette.orange } };

const buttonLogOut = () => {
    auth()
        .signOut()
        .then(() => {
            console.log('User signed out!');
        })
        .catch(e => {
            console.log(e);
        });
}

export const tabbarHeaderOptions = {
    headerRight: () => (
        <Button
            mode="contained"
            onPress={buttonLogOut}
            style={{ marginRight: 5.0 }}
            color={Palette.darkOrange}
        >
            ÇIKIŞ
        </Button>
    ),
    headerStyle: { backgroundColor: Palette.orange },
};

export const stats = [
    { label: "Lise 1", value: 1 },
    { label: "Lise 2", value: 2 },
    { label: "Lise 3", value: 3 },
    { label: "Lise 4", value: 4 },
    { label: "Mezun", value: 5 },
];

export const solvedStats = [
    { label: "Lise 1", value: 1 },
    { label: "Lise 2", value: 2 },
    { label: "Lise 3", value: 3 },
    { label: "Lise 4", value: 4 },
    { label: "Kendi Sorularım", value: 5 },
];

export const lectures = [
    { label: "Türkçe", value: 1 },
    { label: "Matematik", value: 2 },
    { label: "Fizik", value: 3 },
    { label: "Kimya", value: 4 },
    { label: "Biyoloji", value: 5 },
    { label: "Coğrafya", value: 6 },
    { label: "Tarih", value: 7 },
    { label: "Din Kültürü ve Ahlak Bilgisi", value: 8 },
    { label: "Felsefe", value: 9 },
];