
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components/atoms'
import { SCREEN_TITLES } from '../../constants/appConstants';
import { ORANGE, WHITE } from '../../styles/colors';

const TermsAndConditionsScreen = ({ navigation } : { navigation:Object }) => {
    const handleBackButton = () => {
        navigation.goBack();
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE, flex: 1 }}>
            <Text>Terms and Conditions</Text>
            <Button onPress={handleBackButton} >Back</Button>
        </View>
    );
}

export default TermsAndConditionsScreen;
