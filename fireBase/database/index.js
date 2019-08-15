import firebase from 'react-native-firebase';

export const addUserDetailsToDb = async (mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const getUser = async (mobileNumber) => {
  try {
    return await firebase.database().ref(`/users/+91${mobileNumber}`).once('value');
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}
