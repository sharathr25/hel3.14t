import React, { Component } from "react";
import { Text } from 'react-native-elements';
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HelpRequestFeed from "../components/helpRequest/helpRequestFeed";
import HelpingQueueFeed from "../components/helpingQueue/helpingQueueFeed";
import { SCREEN_TITLES } from "../constants/appConstants";
import { COLOR_1 } from "../constants/styleConstants";

const FirstRoute = () => <HelpRequestFeed />;

const SecondRoute = () => <HelpingQueueFeed/>

const ThirdRoute = () => (
  <View style={[styles.scene]} ><Text>Helps Requested</Text></View>
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
              backgroundColor: COLOR_1
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
