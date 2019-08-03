import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const Loader = () => {
    return <View><Text>Please wait we will auto verify OTP will log you in...</Text><ActivityIndicator /></View>
}

export default Loader;