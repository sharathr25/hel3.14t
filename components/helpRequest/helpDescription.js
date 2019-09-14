import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BLACK, FLAG_COLOR_ORANGE } from "../../constants/styleConstants";

const HelpDescription = (props) => {
  const { data } = props;
  const { description, distance,type } = data;
  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.titleContainer}>
        <Text style={{ flex: 3.5 }}>
          <Text style={styles.title}></Text>
        </Text>
        {type !== "USER" && <View style={styles.distanceContainer}>
          <Icon name="map-marker" size={15} color="red" />
          <Text style={styles.distanceText}>{`${distance.toFixed(1)} KM`}</Text>
        </View>}
      </View>
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

export default HelpDescription;

const styles = StyleSheet.create({
  descriptionContainer: {
    margin: 5,
    marginTop: 0,
    padding: 5
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: FLAG_COLOR_ORANGE
  },
  distanceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-evenly"
  },
  distanceText: {
    color: BLACK,
    fontSize: 12
  },
  descriptionTitle: {
    color: "black",
    fontWeight: "bold"
  },
  text: {
    color: BLACK
  },
  description: {
    color: BLACK,
    fontStyle: "italic"
  }
});
