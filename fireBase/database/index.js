import firebase from 'react-native-firebase';

export const addUserDetailsToDb = async (mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/mapping/+91${mobileNumber}`).set({ email, name, gender, dob });
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const getUser = async (mobNo) => {
  try {
    return await firebase.database().ref(`/mapping/+91${mobNo}`).once('value');
  } catch (error) {
    console.log(error);
    Alert.alert(error.toString());
  }
}

export const updateFirebase = (db, key, value) => {
  db.update({ [key]: value });
};

export const updateFirebaseWithURL = async (dbUrl, key, value) => {
  try {
    await firebase.database().ref(dbUrl).update({ [key]: value });
  } catch (error) {
    console.log(error)
  }
}

export const removeFromFirebaseWithURl = async (url) => {
  try {
    firebase.database().ref(url).remove();
  } catch (error) {
    console.log(error);
  }
}

export const pushToFirebaseWithURL = async (dbUrl, data) => {
  try {
    const snapShot = await firebase.database().ref(dbUrl).push(data)
    return snapShot.key;
  } catch (error) {
    console.log(error);
  }
}

export const getDataFromFirebase = async (dbUrl) => {
  try {
    const snapShot = await firebase.database().ref(dbUrl).once('value');
    return snapShot;
  } catch (error) {
    console.log(error)
  }
}

export const firebaseOnEventListner = (dbUrl, eventType, cb) => {
  firebase.database().ref(dbUrl).on(eventType, data => {
    cb(data)
  }, err => console.log(err));
}

export const firebaseOnEventListnerTurnOff = (dbUrl) => {
  firebase.database().ref(dbUrl).off();
}