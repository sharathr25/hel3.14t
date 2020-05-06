import { Platform, Linking, Alert } from 'react-native'

const getURLForMaps = (lat: number, lng: number) => {
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
