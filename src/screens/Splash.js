import React from 'react';
import LottieView from 'lottie-react-native';
import { Palette } from '../theme/Colors';

export default class BasicExample extends React.Component {
    render() {
        return <LottieView
            source={require('../assets/lottie/splash.json')}
            autoPlay
            loop={false}
            style={{ backgroundColor: Palette.primary }} />;
    }
}