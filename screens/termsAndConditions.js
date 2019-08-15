import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { SCREEN_TITLES } from '../constants/appConstants';
import { styles } from '../constants/styleConstants';

class TermsAndConditionsScreen extends Component {
    static navigationOptions = {
        title: SCREEN_TITLES.TERMS_AND_CONDITIONS
    };

    handleBackButton = () => {
        this.props.navigation.navigate('SignUp');
    }

    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Terms and Conditions</Text>
            <Button title="Back" buttonStyle={styles.button} onPress={this.handleBackButton} />
        </View>
    );
  }
}

export default TermsAndConditionsScreen;
