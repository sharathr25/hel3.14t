import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { View } from 'react-native';

class MainScreen extends Component {
  static navigationOptions = {
    title: 'Haisaa'
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const {
      displayName, email, phoneNumber, uid
    } = navigation.state.params.currentUser;
    this.state = {
      name: displayName,
      mobileNumber: phoneNumber,
      email,
      uid
    };
    console.log(navigation.state.params.currentUser);
  }

  render() {
    const {
      name, email, mobileNumber, uid
    } = this.state;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>
Name:
          {' '}
          { name }
        </Text>
        <Text>
Email:
          {' '}
          { email }
        </Text>
        <Text>
Mobile No:
          {' '}
          { mobileNumber }
        </Text>
        <Text>
UID:
          {' '}
          { uid }
        </Text>
      </View>
    );
  }
}

export default MainScreen;
