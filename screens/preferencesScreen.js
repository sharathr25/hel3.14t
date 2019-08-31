import React, { Component } from 'react';
import { View, Text } from 'react-native';

class PreferencesScreen extends Component {
    static navigationOptions = {
        title: 'Preferences'
    };

    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>PreferencesScreen</Text>
        </View>
    );
  }
}

export default PreferencesScreen;
