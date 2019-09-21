import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BLACK, FONT_FAMILY } from "../../constants/styleConstants";


class Distance extends Component {
    render() {
      const { distance } = this.props;
      return (
        <View style={styles.distanceContainer}>
            <Icon name="map-marker" size={15} color="red" />
            <Text style={styles.distanceText}>{`${distance ? distance.toFixed(1): 0} KM`}</Text>
        </View>
    );
  }
}
  
export default Distance;
  
const styles = StyleSheet.create({
distanceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'baseline',
    },
    distanceText: {
    color: BLACK,
    fontSize: 12,
    marginLeft: 5,
    fontFamily: FONT_FAMILY
    },
});