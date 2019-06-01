import React, { Component } from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from '../constants/styleConstants';
import { updateUser } from '../common/fireBaseFunctions';
import { OTP_SCREEN, SCREEN_TITLES } from '../constants/appConstants';
import Loader from '../components/loader';

class OTPVerification extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.OTP
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    console.log(navigation.state.params.userDetails);
    this.state = {
      otp: '',
      confirmResult: null,
      otpConfimationErrorMessage: '',
      error: '',
      loaderVisible: false
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
          error: OTP_SCREEN.ERRORS.TIME_OUT_ERROR
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
          if (email && password && name) { await updateUser(user, email, password, name); }
          if (password) {
            console.log('updating password');
            try {
              await user.updatePassword(password);
            } catch (err) {
              console.log(err);
            }
          }
          console.log('user updated after OTP verification');
          navigation.navigate('Main', { currentUser: firebase.auth().currentUser });
        }
      } catch (error) {
        console.log(error.toString());
        this.setState({
          otpConfimationErrorMessage: OTP_SCREEN.ERRORS.OTP_INVALID_ERROR
        });
      }
    }
  };

  render() {
    const { otpConfimationErrorMessage, error, loaderVisible } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Loader loaderVisible={loaderVisible} />
        <Text style={{ margin: 10, fontWeight: 'bold' }}>
          {OTP_SCREEN.REMINDER}
        </Text>
        <Input
          placeholder="OTP"
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.inputStyle}
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
