import React, { Component } from 'react';
import { Button, Text, CheckBox } from 'react-native-elements';
import { View, Alert, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, SCREEN_TITLES } from '../constants/appConstants';
import { styles, FLAG_COLOR_ORANGE } from '../constants/styleConstants';
import { updateUser } from '../fireBase/auth/signUp';
import { addUserDetailsToDb } from '../fireBase/database';
import {regex} from '../utils/index';
import ErrorMessage from '../components/errorMessage';
import DateComponent from '../components/dateComponent';
import InputComponent from '../components/inputComponent';
import Loader from '../components/inlineLoader';
import { getAge } from '../utils';

class SignUpScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.SIGN_UP
  };

  constructor() {
    super();
    this.state = {
      name: '',
      nameErrorMessage: '',
      mobileNumber: '',
      mobileNumberErrorMessage: '',
      email: '',
      emailErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      confirmPassword: '',
      confirmPasswordErrorMessage: '',
      loaderVisible: false,
      termsAndConditionChecked: false,
      gender: 'male',
      dob: '2016-05-15'
    };
  }

 componentDidMount() {
   // TODO: need to figure out how to call this asynchronous functions so the UI looks good
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const {
          mobileNumber, name, email, password, gender, dob
        } = this.state;
        const { currentUser } = await firebase.auth();
        const { navigation } = this.props;
        await updateUser(currentUser, email, password, name);
        await addUserDetailsToDb(mobileNumber, email, name, gender, dob);
        Alert.alert('verification complete');
        this.setState({ loaderVisible: false});
        navigation.navigate('Main', { currentUser: firebase.auth().currentUser });
      }
    });
  }

  checkFields = () => {
    let valid = false;
    const { name, email, mobileNumber, password, confirmPassword } = this.state;
    if (name.length === 0) {
      this.setState({ nameErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_NAME_ERROR });
    } else if (email.length === 0) {
      this.setState({ emailErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_EMAIL_ERROR });
    } else if (!email.match(regex.email)) {
      this.setState({ emailErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_EMAIL_ERROR });
    } else if (mobileNumber.length === 0) {
      this.setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR });
    } else if (!mobileNumber.match(regex.phoneNo)) {
      this.setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR });
    } else if (password.length === 0) {
      this.setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR });
    } else if (password.length < 6) {
      this.setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR });
    } else if (password !== confirmPassword) {
      this.setState({ confirmPasswordErrorMessage: SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR });
    } else {
      valid = true;
    }
    return valid;
  };

  handleSignUp = async () => {
    if(!this.state.termsAndConditionChecked) {
      Alert.alert("To Sign Up You have to accept Terms and Conditions");
      return;
    }
    if (this.checkFields()) {
      const { mobileNumber,dob } = this.state;
      const age = getAge(dob);
      if(age < 15) {
        Alert.alert("You should be more than 15 years old to sign up");
        return;
      }
      try {
        this.setState({ loaderVisible: true });
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`, true);
      } catch (error) {
        this.setState({ loaderVisible: false });
        console.log(error);
      }
    }
  };

  render() {
    const {
      nameErrorMessage,
      passwordErrorMessage,
      confirmPasswordErrorMessage,
      emailErrorMessage,
      mobileNumberErrorMessage,
      loaderVisible,
      termsAndConditionChecked
    } = this.state;
    return (
      <ScrollView>
        <View style={{alignItems: 'center',justifyContent: 'center',margin: 10}}>
          {/* Name */}
          <InputComponent 
            placeholder="Name" 
            secureTextEntry={false}
            updateParentState={value => this.setState({name: value, nameErrorMessage: ''})} 
          />
          {nameErrorMessage.length !== 0 && <ErrorMessage errorMessage={nameErrorMessage} />}

          {/* Email */}
          <InputComponent 
            placeholder="Email" 
            secureTextEntry={false}
            updateParentState={value => this.setState({ email: value, emailErrorMessage: '' })} 
          />
          {emailErrorMessage.length !== 0 && <ErrorMessage errorMessage={emailErrorMessage} />}

          {/* Mobile number */}
          <InputComponent 
            placeholder="Mobile Number"
            secureTextEntry={false} 
            updateParentState={value => this.setState({ mobileNumber: value, mobileNumberErrorMessage: '' })} 
          />
          {mobileNumberErrorMessage.length !== 0 && <ErrorMessage errorMessage={mobileNumberErrorMessage} />}
          
          {/* password */}
          <InputComponent 
            placeholder="Password" 
            secureTextEntry={true}
            updateParentState={value => this.setState({ password: value, passwordErrorMessage: '' })} 
          />
          {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}
    
          {/* Confirm password */}
          <InputComponent 
            placeholder="Confirm Password"
            secureTextEntry={true} 
            updateParentState={value => this.setState({ confirmPassword: value, confirmPasswordErrorMessage: ''})} 
          />
          {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage errorMessage={confirmPasswordErrorMessage} />}
          
          {/* Date of Birth */}
          <View style={
              {
                display:"flex", 
                justifyContent: 'center', 
                flexDirection:'row', 
                borderColor: FLAG_COLOR_ORANGE,
                borderWidth: 1.5,
                margin: 10,
                borderRadius: 5
              }
            }>
            <Text style={{ fontSize: 20, padding: 10 }}>Date of Birth:</Text>
            <DateComponent date={this.state.dob} updateParentState={date => this.setState({dob: date})}/>
          </View>

          {/* Gender */}
          <View 
            style={
              {
                display:"flex", 
                justifyContent: 'center', 
                flexDirection:'row', 
                borderColor: FLAG_COLOR_ORANGE,
                borderWidth: 1.5,
                margin: 10,
                borderRadius: 5
              }
            }
          >
          <Text style={{ fontSize: 20, padding: 10 }} >Gender:</Text><Picker
            selectedValue={this.state.gender}
            onValueChange={value => this.setState({ gender: value })}
            style={{ width: 230 }}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          </View>

          {/* Terms and Conditions */}
          <CheckBox 
            title="check this to accept terms and conditions" 
            checked={termsAndConditionChecked} 
            onPress={() => this.setState({termsAndConditionChecked: ! termsAndConditionChecked})} />
          
          {/* Sign Up button */}
          <Button title="Sign Up" buttonStyle={styles.button} onPress={this.handleSignUp} />
        </View>
        { loaderVisible && <Loader />}
      </ScrollView>
    );
  }
}

export default SignUpScreen;