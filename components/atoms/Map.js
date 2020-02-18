import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HelpRequestMap = props => {
  const { latitude, longitude, userLatitude, userLongitude } = props;
  const initialRegion = {
    latitude: parseFloat(userLatitude.toFixed(4)),
    longitude: parseFloat(userLongitude.toFixed(4)),
    latitudeDelta: 0.08,
    longitudeDelta: 0.08
  }
  return (
    <View style={{ height: 200}} pointerEvents="none">
      <MapView style={{ ...StyleSheet.absoluteFillObject}} initialRegion={initialRegion} showsUserLocation>
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
};

export default HelpRequestMap;
