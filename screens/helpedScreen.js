import React, { Component } from 'react';
import { View, Text } from 'react-native';

class HelpedScreen extends Component {
    static navigationOptions = {
        title: 'Helped'
    };

    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>HelpedScreen</Text>
        </View>
    );
  }
}

export default HelpedScreen;
