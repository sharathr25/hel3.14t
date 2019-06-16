import React, { Component } from 'react';
import {
  StyleSheet, View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

class HelpRequestMap extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const {
      latitude,
      longitude,
      userLatitude,
      userLongitude
    } = this.props;
    return (
      <View
        style={{
          height: 200
        }}
        pointerEvents="none"
      >
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={
            {
              latitude: parseFloat(userLatitude.toFixed(4)),
              longitude: parseFloat(userLongitude.toFixed(4)),
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }
        }
          showsUserLocation
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      </View>
    );
  }
}

export default HelpRequestMap;
