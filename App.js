/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import * as firebase from 'react-native-firebase';

export default class App extends Component {
  handleSignIn = async () => {
    try{
    const confirmResult = await firebase.auth().signInWithPhoneNumber("+918073710610");
    console.log(confirmResult);
    } catch(err){
      console.log(err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.handleSignIn} title="Sign In"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
