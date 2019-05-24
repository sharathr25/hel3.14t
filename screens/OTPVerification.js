import React, { Component } from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from '../constants/styleConstants';
import { updateUser } from '../common/fireBaseFunctions';

class OTPVerification extends Component {
  static navigationOptions = {
    title: 'OTP Verification'
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    console.log(navigation.state.params.userDetails);
    this.state = {
      otp: '',
      confirmResult: null,
      otpConfimationErrorMessage: '',
      error: ''
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { mobileNumber } = navigation.state.params.userDetails;
    console.log(`sending code... to +91 ${mobileNumber}`);
    firebase
      .auth()
      .signInWithPhoneNumber(`+91${mobileNumber}`)
      .then((confirmResult) => {
        console.log('code sent');
        this.setState({
          confirmResult
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: 'Some error happend please try again later...'
        });
      });
  }

  handleSubmit = async () => {
    const { otp, confirmResult } = this.state;
    this.setState({ error: '', otpConfimationErrorMessage: '' });
    console.log(`verifying code ...${otp}`);
    if (confirmResult && otp.length) {
      try {
        let user = await confirmResult.confirm(otp);
        console.log(user);
        user = firebase.auth().currentUser;
        console.log('currentUser => ', user);
        if (user) {
          const { navigation } = this.props;
          const { name, password, email } = navigation.state.params.userDetails;
          await updateUser(user, email, password, name);
          console.log('user updated after OTP verification');
          navigation.navigate('Main', { currentUser: firebase.auth().currentUser });
        }
      } catch (error) {
        console.log(error.toString());
        this.setState({
          otpConfimationErrorMessage: 'OTP Invalid. Please try again'
        });
      }
    }
  };

  render() {
    const { otpConfimationErrorMessage, error } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ margin: 10, fontWeight: 'bold' }}>
          We have sent an OTP to your mobile number. please enter to verify
        </Text>
        <Input
          placeholder="OTP"
          inputContainerStyle={styles.input}
          containerStyle={{ margin: 10 }}
          onChangeText={value => this.setState({ otp: value })}
        />
        {otpConfimationErrorMessage.length !== 0 && (
          <Text>{otpConfimationErrorMessage}</Text>
        )}
        {error.length !== 0 && <Text>{error}</Text>}
        <Button
          title="submit"
          buttonStyle={styles.button}
          onPress={this.handleSubmit}
        />
      </View>
    );
  }
}

export default OTPVerification;
