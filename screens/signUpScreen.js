import React, { useState, useEffect } from 'react';
import { Button, Text, CheckBox } from 'react-native-elements';
import { View, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import { SIGN_UP_SCREEN, SCREEN_TITLES } from '../constants/appConstants';
import { styles, FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE, FONT_FAMILY } from '../constants/styleConstants';
import { updateUser } from '../fireBase/auth/signUp';
import { addUserDetailsToDb } from '../fireBase/database';
import { regex } from '../utils/index';
import ErrorMessage from '../components/common/errorMessage';
import DateComponent from '../components/common/dateComponent';
import InputComponent from '../components/common/inputComponent';
import Loader from '../components/common/inlineLoader';
import { getAge } from '../utils';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

const CREATE_USER = gql`
mutation CreateUser($uid:String!) {
  createUser(uid:$uid){
    uid
  }
}
`;

function SignUpScreen(props) {
  const [state, setState] = useState({
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
  });
  const [createUser, { loading }] = useMutation(CREATE_USER);

  useEffect(() => {
    const unsubscibe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const { mobileNumber, name, email, password, gender, dob } = state;
        const { currentUser } = await firebase.auth();
        const { navigation } = props;
        try {
          await updateUser(currentUser, email, password, name);
          await addUserDetailsToDb(currentUser.uid, mobileNumber, email, name, gender, dob);
          createUser({ variables: { uid: currentUser.uid } });
        } catch (error) {
          console.log(error);
        }
        Alert.alert('verification complete');
        setState({ ...state,loaderVisible: false });
        navigation.navigate('Main', { currentUser: currentUser });
      }
    });
    return (() => unsubscibe());
  }, [state.mobileNumber, state.name, state.email, state.password]);

  handleTermsAndConditions = () => {
    const { navigation } = props;
    navigation.navigate('TermsAndConditions', { currentUser: firebase.auth().currentUser });
  }

  checkFields = () => {
    let valid = false;
    const { name, email, mobileNumber, password, confirmPassword } = state;
    if (name.length === 0) {
      setState({ ...state,nameErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_NAME_ERROR });
    } else if (email.length === 0) {
      setState({ ...state,emailErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_EMAIL_ERROR });
    } else if (!email.match(regex.email)) {
      setState({ ...state,emailErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_EMAIL_ERROR });
    } else if (mobileNumber.length === 0) {
      setState({ ...state,mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR });
    } else if (!mobileNumber.match(regex.phoneNo)) {
      setState({ ...state,mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR });
    } else if (password.length === 0) {
      setState({ ...state,passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR });
    } else if (password.length < 6) {
      setState({ ...state,passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR });
    } else if (password !== confirmPassword) {
      setState({ ...state,confirmPasswordErrorMessage: SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR });
    } else {
      valid = true;
    }
    return valid;
  };

  handleSignUp = async () => {
    if (!state.termsAndConditionChecked) {
      Alert.alert("To Sign Up You have to accept Terms and Conditions");
      return;
    }
    if (checkFields()) {
      const { mobileNumber, dob } = state;
      const age = getAge(dob);
      if (age < 15) {
        Alert.alert("You should be more than 15 years old to sign up");
        return;
      }
      try {
        setState({ ...state,loaderVisible: true });
        await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
      } catch (error) {
        setState({ ...state,loaderVisible: false });
        console.log(error);
        Alert.alert(error.toString());
      }
    }
  };

  handleCheckBox = (val) => {
    setState({ ...state,gender: val });
  }

  getCheckBoxStyle = (val) => [formStyles.defaultCheckBoxStyle, state.gender === val ? formStyles.activeCheckBox : formStyles.inActiveCheckBox];

  getCheckBoxTextStyle = (val) => state.gender === val ? formStyles.activeText : formStyles.inActiveText;

  const {
    nameErrorMessage,
    passwordErrorMessage,
    confirmPasswordErrorMessage,
    emailErrorMessage,
    mobileNumberErrorMessage,
    loaderVisible,
    termsAndConditionChecked
  } = state;

  return (
    <ScrollView>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
        {/* Name */}
        <InputComponent
          placeholder="Name"
          secureTextEntry={false}
          updateParentState={value => setState({ ...state,name: value, nameErrorMessage: '' })}
        />
        {nameErrorMessage.length !== 0 && <ErrorMessage errorMessage={nameErrorMessage} />}

        {/* Email */}
        <InputComponent
          placeholder="Email"
          secureTextEntry={false}
          updateParentState={value => setState({ ...state,email: value, emailErrorMessage: '' })}
        />
        {emailErrorMessage.length !== 0 && <ErrorMessage errorMessage={emailErrorMessage} />}

        {/* Mobile number */}
        <InputComponent
          placeholder="Mobile Number"
          secureTextEntry={false}
          updateParentState={value => setState({ ...state,mobileNumber: value, mobileNumberErrorMessage: '' })}
        />
        {mobileNumberErrorMessage.length !== 0 && <ErrorMessage errorMessage={mobileNumberErrorMessage} />}

        {/* password */}
        <InputComponent
          placeholder="Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state,password: value, passwordErrorMessage: '' })}
        />
        {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}

        {/* Confirm password */}
        <InputComponent
          placeholder="Confirm Password"
          secureTextEntry={true}
          updateParentState={value => setState({ ...state,confirmPassword: value, confirmPasswordErrorMessage: '' })}
        />
        {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage errorMessage={confirmPasswordErrorMessage} />}

        {/* Date of Birth */}
        <View style={formStyles.dob}>
          <Text style={{ fontSize: 20, padding: 10 }}>Date of Birth</Text>
          <DateComponent date={state.dob} updateParentState={date => setState({ ...state,dob: date })} />
        </View>

        {/* Gender */}
        <View style={formStyles.genderSelector}>
          <Text style={{ fontSize: 20, padding: 10 }} >Gender</Text>
          <TouchableOpacity onPress={() => handleCheckBox("male")} style={getCheckBoxStyle("male")}>
            <Text style={getCheckBoxTextStyle("male")}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCheckBox("female")} style={getCheckBoxStyle("female")}>
            <Text style={getCheckBoxTextStyle("female")}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <CheckBox
          title={<View><Text>Creating an acount means you're akay with our </Text><TouchableOpacity onPress={handleTermsAndConditions}><Text style={{ color: '#3a8bbb' }}>Terms of Service, Privacy, Policy</Text></TouchableOpacity></View>}
          checked={termsAndConditionChecked}
          onPress={() => setState({ ...state,termsAndConditionChecked: !termsAndConditionChecked })}
          checkedColor={FLAG_COLOR_ORANGE}
        />
        {/* Sign Up button */}
        {!loaderVisible && <Button title="Sign Up" buttonStyle={styles.button} onPress={handleSignUp} />}
        {loaderVisible && <Loader title="Please wait..." message="we will auto verify OTP and log you in" />}
      </View>
    </ScrollView>
  );
}

// class SignUpScreen1 extends Component {
//   static navigationOptions = {
//     title: SCREEN_TITLES.SIGN_UP,
//     headerLeft: null
//   };

//   constructor() {
//     super();
//     this.state = {
//       name: '',
//       nameErrorMessage: '',
//       mobileNumber: '',
//       mobileNumberErrorMessage: '',
//       email: '',
//       emailErrorMessage: '',
//       password: '',
//       passwordErrorMessage: '',
//       confirmPassword: '',
//       confirmPasswordErrorMessage: '',
//       loaderVisible: false,
//       termsAndConditionChecked: false,
//       gender: 'male',
//       dob: '2016-05-15'
//     };
//   }

//   componentDidMount() {
//     // TODO: need to figure out how to call this asynchronous functions so the UI looks good
//     firebase.auth().onAuthStateChanged(async (user) => {
//       if (user) {
//         const { mobileNumber, name, email, password, gender, dob } = this.state;
//         const { currentUser } = await firebase.auth();
//         const { navigation } = this.props;
//         try {
//           await updateUser(currentUser, email, password, name);
//           await addUserDetailsToDb(currentUser.uid, mobileNumber, email, name, gender, dob);
//         } catch (error) {
//           console.log(error);
//         }
//         Alert.alert('verification complete');
//         this.setState({ loaderVisible: false });
//         navigation.navigate('Main', { currentUser: currentUser });
//       }
//     });
//   }

//   handleTermsAndConditions = () => {
//     const { navigation } = this.props;
//     navigation.navigate('TermsAndConditions', { currentUser: firebase.auth().currentUser });
//   }

//   checkFields = () => {
//     let valid = false;
//     const { name, email, mobileNumber, password, confirmPassword } = this.state;
//     if (name.length === 0) {
//       this.setState({ nameErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_NAME_ERROR });
//     } else if (email.length === 0) {
//       this.setState({ emailErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_EMAIL_ERROR });
//     } else if (!email.match(regex.email)) {
//       this.setState({ emailErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_EMAIL_ERROR });
//     } else if (mobileNumber.length === 0) {
//       this.setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_MOBILE_NUMBER_ERROR });
//     } else if (!mobileNumber.match(regex.phoneNo)) {
//       this.setState({ mobileNumberErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_MOBILE_NUMBER_ERROR });
//     } else if (password.length === 0) {
//       this.setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.EMPTY_PASSWORD_ERROR });
//     } else if (password.length < 6) {
//       this.setState({ passwordErrorMessage: SIGN_UP_SCREEN.ERRORS.INVALID_PASSWORD_ERROR });
//     } else if (password !== confirmPassword) {
//       this.setState({ confirmPasswordErrorMessage: SIGN_UP_SCREEN.ERRORS.PASSWORD_MISMATCH_ERROR });
//     } else {
//       valid = true;
//     }
//     return valid;
//   };

//   handleSignUp = async () => {
//     if (!this.state.termsAndConditionChecked) {
//       Alert.alert("To Sign Up You have to accept Terms and Conditions");
//       return;
//     }
//     if (this.checkFields()) {
//       const { mobileNumber, dob } = this.state;
//       const age = getAge(dob);
//       if (age < 15) {
//         Alert.alert("You should be more than 15 years old to sign up");
//         return;
//       }
//       try {
//         this.setState({ loaderVisible: true });
//         await firebase.auth().signInWithPhoneNumber(`+91${mobileNumber}`);
//       } catch (error) {
//         this.setState({ loaderVisible: false });
//         console.log(error);
//         Alert.alert(error.toString());
//       }
//     }
//   };

//   handleCheckBox = (val) => {
//     this.setState({ gender: val });
//   }

//   getCheckBoxStyle = (val) => [formStyles.defaultCheckBoxStyle, this.state.gender === val ? formStyles.activeCheckBox : formStyles.inActiveCheckBox];

//   getCheckBoxTextStyle = (val) => this.state.gender === val ? formStyles.activeText : formStyles.inActiveText;

//   render() {
// const {
//   nameErrorMessage,
//   passwordErrorMessage,
//   confirmPasswordErrorMessage,
//   emailErrorMessage,
//   mobileNumberErrorMessage,
//   loaderVisible,
//   termsAndConditionChecked
// } = this.state;
//     return (
//       <ScrollView>
//         <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
//           {/* Name */}
//           <InputComponent
//             placeholder="Name"
//             secureTextEntry={false}
//             updateParentState={value => this.setState({ name: value, nameErrorMessage: '' })}
//           />
//           {nameErrorMessage.length !== 0 && <ErrorMessage errorMessage={nameErrorMessage} />}

//           {/* Email */}
//           <InputComponent
//             placeholder="Email"
//             secureTextEntry={false}
//             updateParentState={value => this.setState({ email: value, emailErrorMessage: '' })}
//           />
//           {emailErrorMessage.length !== 0 && <ErrorMessage errorMessage={emailErrorMessage} />}

//           {/* Mobile number */}
//           <InputComponent
//             placeholder="Mobile Number"
//             secureTextEntry={false}
//             updateParentState={value => this.setState({ mobileNumber: value, mobileNumberErrorMessage: '' })}
//           />
//           {mobileNumberErrorMessage.length !== 0 && <ErrorMessage errorMessage={mobileNumberErrorMessage} />}

//           {/* password */}
//           <InputComponent
//             placeholder="Password"
//             secureTextEntry={true}
//             updateParentState={value => this.setState({ password: value, passwordErrorMessage: '' })}
//           />
//           {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}

//           {/* Confirm password */}
//           <InputComponent
//             placeholder="Confirm Password"
//             secureTextEntry={true}
//             updateParentState={value => this.setState({ confirmPassword: value, confirmPasswordErrorMessage: '' })}
//           />
//           {confirmPasswordErrorMessage.length !== 0 && <ErrorMessage errorMessage={confirmPasswordErrorMessage} />}

//           {/* Date of Birth */}
//           <View style={formStyles.dob}>
//             <Text style={{ fontSize: 20, padding: 10 }}>Date of Birth</Text>
//             <DateComponent date={this.state.dob} updateParentState={date => this.setState({ dob: date })} />
//           </View>

//           {/* Gender */}
//           <View style={formStyles.genderSelector}>
//             <Text style={{ fontSize: 20, padding: 10 }} >Gender</Text>
//             <TouchableOpacity onPress={() => this.handleCheckBox("male")} style={this.getCheckBoxStyle("male")}>
//               <Text style={this.getCheckBoxTextStyle("male")}>Male</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => this.handleCheckBox("female")} style={this.getCheckBoxStyle("female")}>
//               <Text style={this.getCheckBoxTextStyle("female")}>Female</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Terms and Conditions */}
//           <CheckBox
//             title={<View><Text>Creating an acount means you're akay with our </Text><TouchableOpacity onPress={this.handleTermsAndConditions}><Text style={{ color: '#3a8bbb' }}>Terms of Service, Privacy, Policy</Text></TouchableOpacity></View>}
//             checked={termsAndConditionChecked}
//             onPress={() => this.setState({ termsAndConditionChecked: !termsAndConditionChecked })}
//             checkedColor={FLAG_COLOR_ORANGE}
//           />
//           {/* Sign Up button */}
//           {!loaderVisible && <Button title="Sign Up" buttonStyle={styles.button} onPress={this.handleSignUp} />}
//           {loaderVisible && <Loader title="Please wait..." message="we will auto verify OTP and log you in" />}
//         </View>
//       </ScrollView>
//     );
//   }
// }

SignUpScreen.navigationOptions = {
  title: SCREEN_TITLES.SIGN_UP,
  headerLeft: null
}

export default SignUpScreen;

const formStyles = StyleSheet.create({
  genderSelector: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeCheckBox: {
    backgroundColor: FLAG_COLOR_ORANGE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  defaultCheckBoxStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    margin: 5,
    borderRadius: 5
  },
  inActiveCheckBox: {
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: FLAG_COLOR_ORANGE,
  },
  activeText: {
    color: FLAG_COLOR_WHITE,
    fontSize: 15,
    fontFamily: FONT_FAMILY
  },
  inActiveText: {
    color: FLAG_COLOR_ORANGE,
    fontSize: 15,
    fontFamily: FONT_FAMILY
  },
  dob: {
    display: "flex",
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: FLAG_COLOR_ORANGE,
    borderWidth: 1.5,
    margin: 10,
    borderRadius: 5
  }
});