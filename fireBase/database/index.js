import firebase from 'react-native-firebase';

export const addUserDetailsToDb = async (uid,mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/${uid}`).set({ mobileNumber,email, name, gender, dob });
    await firebase.database().ref(`/mapping/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const getUser = async (uid) => {
  try {
    return await firebase.database().ref(`/users/${uid}`).once('value');
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}
