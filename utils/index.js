// @flow
import { Platform, Linking, Alert } from 'react-native'
export const regex = {
    email : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phoneNo:  /^\d{10}$/
}

export const getPluralStr = (value: number, str: string) =>
Math.floor(value) === 0
  ? ""
  : Math.floor(value) === 1
  ? `${Math.floor(value)} ${str}`
  : `${Math.floor(value)} ${str}s`;

export const getTimeDiffrence = (time: number) => {
  const currentTime = new Date().getTime();
  const inMilliSeconds = currentTime - time;
  const inSeconds = inMilliSeconds / 1000;
  const inMinutes = inSeconds / 60;
  if (inMinutes < 60) {
    return `${getPluralStr(inMinutes, "Minute")} ago`;
  }
  const inHours = inMinutes / 60;
  if (inHours < 24) {
    return `${getPluralStr(inHours, "Hour")} ago`;
  }
  const inDays = inHours / 24;
  if (inDays < 30) {
    return `${getPluralStr(inDays, "Day")} ago`
  }
  return "Long time ago";
};

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};
  
const deg2rad = deg => deg * (Math.PI / 180);
  
export const getAge = (dob: string) => {
  const birthday = new Date(dob);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
  
  
export const sortByDistance = (helpRequests: Array<Object>):Array<Object> => {
  const sortedHelpRequests = helpRequests.sort((a,b) => {
    return a.distance > b.distance ? 1 : -1
  })
  return sortedHelpRequests;
}

export const getURLForMaps = (lat: number, lng: number) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const label = 'Custom Label';
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  });
  return url;
}


export const openMapsAppWithLatLng = (lat: number, lng: number) => {
  const url = getURLForMaps(lat, lng);
  Linking.openURL(url);
}

export const callPhone = (phone: string) => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else  {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
    }
  })
  .catch(err => console.log(err));
}

// type ValidatatorType = {
//   isValid: Function,
//   getMessage: Function,
//   setValue: Function
// }

// export class EmailValidator {
//   constructor() {
//     this.email = ""
//     this.regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
//   }

//   setValue(email: string) {
//     this.email = email
//   }

//   isValid() {
//     return this.email.length !== 0 && this.regex.test(this.email)
//   }

//   getMessage() {
//     if(this.value.length === 0) return "* Required"
//     if(!this.regex.test(this.email)) return "Invalid email" 
//     return ""
//   }
// }

// export class PhoneNumberValidator {
//   constructor() {
//     this.phoneNumber = ""
//     this.regex = /^\d{10}$/
//   }

//   setValue(phoneNumber: string) {
//     this.phoneNumber = phoneNumber
//   }

//   isValid() {
//     return this.phoneNumber.length !== 0 && this.regex.test(this.phoneNumber)
//   }

//   getMessage() {
//     if(this.phoneNumber.length === 0) return "* Required"
//     if(!this.regex.test(this.phoneNumber)) return "Invalid phone number" 
//     return ""
//   }
// }

// export class DateOfBirthValidator {
//   constructor() {
//     this.dateOfBirth = ""
//     this.limit = 15
//   }

//   setValue(dateOfBirth: string) {
//     this.dateOfBirth = dateOfBirth
//   }

//   isValid() {
//     return this.dateOfBirth.length !== 0 && getAge(this.dateOfBirth) >= limit
//   }

//   getMessage() {
//     if(this.dateOfBirth.length === 0) return "* Required"
//     if(getAge(this.dateOfBirth) < limit) return `Age should more than ${this.limit}`; 
//     return ""
//   }
// }

// export class PasswordValidator {
//   constructor() {
//     this.password = ""
//     this.limit = 6
//   }

//   setValue(password: string) {
//     this.password = password
//   }

//   isValid() {
//     return this.password.length !== 0 && this.password >= limit
//   }

//   getMessage() {
//     if(this.password.length === 0) return "* Required"
//     if(this.password < limit) return `Password should be more than ${this.limit}` 
//     return ""
//   }
// }

// export class ConfirmPasswordValidator {
//   constructor() {
//     this.password = ""
//     this.confirmedPassword = ""
//   }

//   setValue(password: string, confirmedPassword: string) {
//     this.password = password
//     this.confirmedPassword = confirmedPassword
//   }

//   isValid() {
//     return this.confirmedPassword.length !== 0 && this.confirmedPassword != this.password
//   }

//   getMessage() {
//     if(this.confirmedPassword.length === 0) return "* Required"
//     if(this.confirmedPassword !== this.password) return "Confirmed password is not mathching with password" 
//     return ""
//   }
// }

// export class Validatator {
//   constructor(validator: ValidatatorType) {
//     this.validator = validator
//   }

//   setValue(value: string) {
//     this.validator.setValue(value)
//   }

//   isValid() {
//     return this.validator.isValid()
//   }

//   getMessage() {
//     return this.validator.getMessage()
//   }
// }
