import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Alert,Text } from 'react-native';
import fireBase from 'react-native-firebase';
import { SCREEN_TITLES } from '../constants/appConstants';
import { styles, FLAG_COLOR_WHITE } from '../constants/styleConstants';
import { getEmail, loginWithEmailAndPassword} from '../fireBase/auth/login';
import { checkUserNameAndPasswordFields, regex } from '../utils/index';
import ErrorMessage from '../components/common/errorMessage';
import ScreenRedirecter from '../components/common/screenRedirecter';
import InputComponent from '../components/common/inputComponent';
import Loader from '../components/common/inlineLoader';

const emailRegex = regex.email;

class LoginScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.LOGIN
  };

  constructor() {
    super();
    this.state = {
      userName: '',
      userNameErrorMessage: '',
      password: '',
      passwordErrorMessage: '',
      loaderVisible: false
    };
  }

  componentDidMount() {
    const { currentUser } = fireBase.auth();
    if(currentUser){
      //TODO : later we have to navigate the user to Main screen if he is loged in already for testing we r logging hime out
       this.props.navigation.replace("Main");
      //fireBase.auth().signOut();
    }
  }

  checkUserNameAndPasswordFields = () => {
    const { userName, password } = this.state;
    const datum = checkUserNameAndPasswordFields(userName, password);
    if(datum.valid)return datum.valid
    else {
      const { key } = datum;
      this.setState({ [key] : datum[key]})
    }
  };

  loginWithMobileNumber = async (mobileNumber, password) => {
    try {
      const email = await getEmail(mobileNumber);
      if(email){
        await this.loginWithEmail(email, password);
      } else {
        Alert.alert('user not found');
      } 
    } catch (error) {
      console.log(error);
      Alert.alert('user not found');
    }
  }

  loginWithEmail = async (email, password) => {
    const { navigation } = this.props;
    try {
      const user  = await loginWithEmailAndPassword(email,password);
      this.setState({ loaderVisible: false });
      navigation.navigate('Main', { currentUser: user });
    } catch (err) {
      Alert.alert('invalid username or password. please try again...');
      console.log(err);
    }
  }

  handleLogin = async () => {
    const { userName, password} = this.state;
    this.setState({loaderVisible: true});
    if (this.checkUserNameAndPasswordFields()) {
      if (userName.match(emailRegex)) {
        await this.loginWithEmail(userName, password);
      } else {
        await this.loginWithMobileNumber(userName, password);
      }
    }
    this.setState({loaderVisible: false});
  }

  handleSignUp = () => {
    const { navigation } = this.props;
    navigation.navigate('SignUp');
  }

  handleResetPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('ResetPassword');
  }

  render() {
    const { passwordErrorMessage, userNameErrorMessage, loaderVisible } = this.state;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <InputComponent 
          placeholder="Email or Mobile Number" 
          secureTextEntry={false} 
          updateParentState={value => this.setState({ userName: value, userNameErrorMessage: '' })} 
        />
        {userNameErrorMessage.length !== 0 && <ErrorMessage errorMessage={userNameErrorMessage} />}
        <InputComponent 
          placeholder="Password" 
          secureTextEntry={true} 
          updateParentState={value => this.setState({ password: value, passwordErrorMessage: '' })} 
        />
        {passwordErrorMessage.length !== 0 && <ErrorMessage errorMessage={passwordErrorMessage} />}
        {!loaderVisible && <Button
          title="Login"
          titleStyle={{ color: FLAG_COLOR_WHITE }}
          buttonStyle={styles.button}
          onPress={this.handleLogin}
        />}
        {loaderVisible && <Loader title="Please Wait..."/>}
        <ScreenRedirecter title="New user?" buttonText="Sign up" handleRedirection={this.handleSignUp}/>
        <ScreenRedirecter title="Forgot password?" buttonText="Reset Password" handleRedirection={this.handleResetPassword}/>
      </View>
    );
  }
}

export default LoginScreen;
