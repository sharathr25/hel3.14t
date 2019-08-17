import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HelpRequestPeopleCount from "./helpRequestPeopleCount";
import { BLACK, COLOR_1, FLAG_COLOR_ORANGE } from "../../constants/styleConstants";

class HelpDescription extends Component {
  render() {
    const { data } = this.props;
    const { description, noPeople, title, distance=10, noPeopleRequested } = data;
    return (
      <View style={styles.descriptionContainer}>
        <View style={styles.titleContainer}>
          <Text style={{ flex: 3.5 }}>
            <Text style={styles.title}>{title}</Text>
          </Text>
          <View style={styles.distanceContainer}>
            <Icon name="map-marker" size={15} color="red" />
            <Text style={styles.distanceText}>{`${distance.toFixed(1)} KM`}</Text>
          </View>
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>
            {`"${description}...${description}...${description} ${description}"`}
          </Text>
        </View>
        <HelpRequestPeopleCount noPeople={noPeople} noPeopleRequested={noPeopleRequested}/>
      </View>
    );
  }
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
