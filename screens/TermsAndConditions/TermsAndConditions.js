// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../components/atoms'
import { SCREEN_TITLES } from '../../constants/appConstants';
import { ORANGE } from '../../styles/colors';

const TermsAndConditionsScreen = ({ navigation } : { navigation:Object }) => {
    const handleBackButton = () => {
        navigation.navigate('SignUp');
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Terms and Conditions</Text>
            <Button onPress={handleBackButton} >Back</Button>
        </View>
    );
}

export default TermsAndConditionsScreen;
