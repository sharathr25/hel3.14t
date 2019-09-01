import React, { Component } from 'react';
import { View, Text } from 'react-native';

class MyHelpRequestsScreen extends Component {
    static navigationOptions = {
        title: 'My Help Requests'
    };

    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>MyHelpRequestsScreen</Text>
        </View>
    );
  }
}

export default MyHelpRequestsScreen;
