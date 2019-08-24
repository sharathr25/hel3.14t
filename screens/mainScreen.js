import React, { Component } from "react";
import { Text } from 'react-native-elements';
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HelpRequestFeed from "../components/helpRequest/helpRequestFeed";
import { SCREEN_TITLES } from "../constants/appConstants";
import { FLAG_COLOR_ORANGE } from "../constants/styleConstants";
import HelpRequestForm from "../components/helpRequest/helpRequestForm";

const FirstRoute = () => <View style={{flex:1}}><HelpRequestFeed db="helps" /><HelpRequestForm /></View>;

const SecondRoute = () => <HelpRequestFeed db="helping" />;

const ThirdRoute = () => (
  <View style={[styles.scene]} ><Text>route 3</Text></View>
);

class MainScreen extends Component {
  static navigationOptions = {
    title: SCREEN_TITLES.MAIN
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "HELPPLZ" },
        { key: "second", title: "HELPING" },
        { key: "third", title: "REQUESTED" }
      ]
    };
  }

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{
              backgroundColor: FLAG_COLOR_ORANGE
            }}
          />
        )}
      />
    );
  }
}

export default MainScreen;

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
