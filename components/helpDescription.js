import React, { Component } from 'react';
import {
  Text, StyleSheet, View
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { FLAG_COLOR_BLUE } from '../constants/styleConstants';

const person = require('../__assets__/user.svg');

class HelpDescription extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const { data } = this.props;
    const {
      description, noPeople, title, distance
    } = data;
    return (
      <View style={{ margin: 5, marginTop: 0 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ color: FLAG_COLOR_BLUE, flex: 3.5 }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>{title}</Text></Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.text}>{`${distance.toFixed(1)} KM`}</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
          <Text style={styles.text}>Number of people required:</Text>
          <SvgUri source={person} width="15" height="15" style={{ margin: 2, marginRight: 0 }} />
          <Text>{noPeople}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: FLAG_COLOR_BLUE }}>Description:</Text>
          <Text>{`${description}...${description}...${description} ${description}`}</Text>
        </View>
      </View>
    );
  }
}

export default HelpDescription;

const styles = StyleSheet.create({
  text: {
    color: FLAG_COLOR_BLUE,
  }
});
