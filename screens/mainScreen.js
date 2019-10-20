import React, { Component } from "react";
import { Text } from 'react-native-elements';
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from 'react-navigation';
import HelpRequestFeed from "../components/helpRequest/helpRequestFeed";
import HelpRequestForm from "../components/helpRequest/helpRequestForm";

const FirstRoute = () => <View style={{flex:1}}><HelpRequestFeed db="helps" /><HelpRequestForm /></View>;

const SecondRoute = () => <HelpRequestFeed db="helping" />;

const ThirdRoute = () => <View style={[styles.scene]} ><Text>route 3</Text></View>


const BottomTabNavigator = createBottomTabNavigator({
  first:{screen:FirstRoute},
  second:{screen:SecondRoute},
  thirde:{screen:ThirdRoute}
},{
  initialRouteName:'first'
})
class MainScreen extends Component {
  render() {
    return (
      <BottomTabNavigator />
    );
  }
}

export default MainScreen;

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
