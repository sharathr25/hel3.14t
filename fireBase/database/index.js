import firebase from 'react-native-firebase';

export const addUserDetailsToDb = async (mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
  }
}
