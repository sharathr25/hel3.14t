import firebase from 'react-native-firebase';
import Crashes from 'mobile-center-crashes';

export const addUserDetailsToDb = async (mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
    Crashes.generateTestCrash()
  }
}
