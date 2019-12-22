import firebase from 'react-native-firebase';

const FIREBASE_FETCH_LIMIT = 10;

export const addUserDetailsToDb = async (uid,mobileNumber, email, name, gender, dob) => {
  try {
    await firebase.database().ref(`/users/${uid}`).set({ mobileNumber,email, name, gender, dob, xp:0 });
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

export const updateFirebase = (db,key,value) => {
  db.update({ [key]: value });
};

export const updateFirebaseWithURL = async (dbUrl, key, value) => {
  try {
    await firebase.database().ref(dbUrl).update({[key]:value });
  } catch (error) {
    console.log(error)
  }
}

export const pushToFirebase = async (db, value) => {
  try {
    const snapShot = await db.push(value);
    return snapShot;
  } catch (error) {
    console.log(error);
  }
}

export const notifyUser = async (uid,data) => {
  try {
    await pushToFirebase(firebase.database().ref('users').child(uid).child('notifications'),data);
  } catch (error) {
    console.log(error)
  }
}

export const removeFromFirebase = async (db,value) => {
  try {
    const data = await db.orderByValue(value).equalTo(value).limitToFirst(1).once('value');
    db.child(Object.keys(data.val())[0]).remove();      
  } catch (error) {
    console.log(error);
  }
} 

export const removeFromFirebaseWithUrlAndValue = async (dbUrl,value) => {
  try {
    const data = await firebase.database().ref(dbUrl).orderByValue(value).equalTo(value).limitToFirst(1).once('value');
    firebase.database().ref(dbUrl).child(Object.keys(data.val())[0]).remove();      
  } catch (error) {
    console.log(error);
  }
} 

export const removeFromFirebaseOrderingChild = async (dbUrl,value) => {
  try {
    const data = await firebase.database().ref(dbUrl).orderByChild("idOfHelpRequest").equalTo(value).limitToFirst(1).once('value');
    firebase.database().ref(dbUrl).child(Object.keys(data.val())[0]).remove();
  } catch (error) {
    console.log(error);
  }
}

export const removeFromFirebaseWithURl = async (url) => {
  try {
    firebase.database().ref(url).remove();
  } catch (error) {
    console.log(error);
  }
}

export const pushToFirebaseWithURL = async (dbUrl,data) => {
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

export const getDataFromFirebaseByValue = async (dbUrl, value) => {
  try {
    const snapShot = await firebase.database().ref(dbUrl).orderByValue(value).equalTo(value).limitToFirst(1).once('value');
    return snapShot;    
  } catch (error) {
    console.log(error)
  }
}

export const firebaseOnEventListner = (dbUrl,eventType,cb) => {
  firebase.database().ref(dbUrl).on(eventType,data => {
    cb(data)
  },err => console.log(err));
} 

export const firebaseOnEventListnerTurnOff = (dbUrl) => {
  firebase.database().ref(dbUrl).off();
}

export const getFeed = (db, firstTime, referenceToOldestKey, limit) => {
  if(firstTime) {
    if(limit === 1) {
      return firebase.database().ref(`${db}`).orderByKey().limitToLast(limit).once("value");
    } else {
      return firebase.database().ref(`${db}`).orderByKey().limitToFirst(limit).once("value");
    }
  } else {
    return firebase.database().ref(`${db}`).orderByKey().startAt(referenceToOldestKey).limitToFirst(limit+1).once("value");
  }
}