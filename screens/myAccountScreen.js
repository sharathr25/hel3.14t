import React, { Component } from 'react';
import { View, Text } from 'react-native';

class MyAccountScreen extends Component {
    static navigationOptions = {
        title: 'My Account'
    };

    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>MyAccountScreen</Text>
        </View>
    );
  }
}

export default MyAccountScreen;
