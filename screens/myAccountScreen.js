import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

class MyAccountScreen extends Component {
    static navigationOptions = {
        title: 'My Account'
    };
    handleLogOut = () => {
        console.log(this.props.navigation);
        // firebase.auth().signOut();
    }
    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>MyAccountScreen</Text>
            <TouchableOpacity onPress={this.handleLogOut}><Text>Log Out</Text></TouchableOpacity>
        </View>
    );
  }
}

export default MyAccountScreen;
