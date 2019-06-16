import React, { Component } from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { FLAG_COLOR_GREEN, FLAG_COLOR_ORANGE, FLAG_COLOR_BLUE } from '../constants/styleConstants';

class ProgressBar extends Component {
  getInPercenage = (value, total) => {
    const percentage = (value/total)*100;
    return Math.round(percentage);
  }

  render() {
    const { pushUps, pullUps } = this.props;
    const pushUpsInPercentage = this.getInPercenage(this.props.pushUps,this.props.pushUps+this.props.pullUps);
    return (
      <View>
        <View style={[styles.flexBox, styles.progressBar]}>
          <View style={[styles.progressBar_left, {flex:pushUpsInPercentage}]}><Text style={styles.progressBarText} numberOfLines={1}>{pushUps}</Text></View>
          <View style={[styles.progressBar_right, {flex:100 - pushUpsInPercentage}]}><Text style={styles.progressBarText} numberOfLines={1}>{pullUps}</Text></View>
        </View>
    </View>
    );
  }
}

export default ProgressBar;

const styles = StyleSheet.create({
    flexBox: {
        flex: 1,
        flexDirection: 'row',
    },
    progressBar: {
        overflow: 'hidden',
        height: 25,
        maxHeight: 25,
        borderRadius: 10,
        margin: 5
    },
    progressBarText: {
      color: 'white', flex:1, fontSize: 15, padding: 2
    },
    progressBar_left: {
        backgroundColor: FLAG_COLOR_BLUE,
        alignItems: 'center',
        opacity: 0.7
    },
    progressBar_right: {
        backgroundColor: FLAG_COLOR_ORANGE,
        alignItems: 'center',
    }
 })
