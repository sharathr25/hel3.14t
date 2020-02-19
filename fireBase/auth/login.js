
// @flow
import firebase from 'react-native-firebase';

export const getEmail = async (mobileNumber : string) => {
    try {
      const data = await firebase.database().ref(`/mapping/+91${mobileNumber}`).once('value', () => {}, () => {});
      const email = data.val() && data.val().email;
      return email;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

 export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }