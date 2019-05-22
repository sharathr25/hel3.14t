import React, { Component } from "react";
import { View, Text } from "react-native";

class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      dob: "",
      value: null
    };
  }
  static navigationOptions = {
    title: "Sign Up"
  };

  render() {
    return (
      <View>
        <Text>Sign up</Text>
      </View>
    );
  }
}

export default SignUpScreen;
