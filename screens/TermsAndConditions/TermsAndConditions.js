// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { SCREEN_TITLES } from '../../constants/appConstants';
import { styles } from '../../constants/styleConstants';

const TermsAndConditionsScreen = ({navigation}:{navigation:Object}) => {
    const handleBackButton = () => {
        navigation.navigate('SignUp');
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Terms and Conditions</Text>
            <Button title="Back" buttonStyle={styles.button} onPress={handleBackButton} />
        </View>
    );
}

export default TermsAndConditionsScreen;
