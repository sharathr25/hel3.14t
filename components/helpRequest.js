import React, { Component } from 'react';
import {
  View
} from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import HelpDescription from './helpDescription';
import HelpRequestFooter from './helpRequestFooter';
import Time from './time';
import { FLAG_COLOR_ORANGE } from '../constants/styleConstants';

class HelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      key: data.key,
      pushUps: data.pushUps
    };
  }

  componentDidMount() {
    const { key } = this.state;
    firebase.database().ref('helps').child(key).on('child_changed', (pushUps) => {
      this.setState({ pushUps: pushUps.val() });
    });
  }

  handlePush = () => {
    const { data } = this.props;
    const { pushUps } = this.state;
    firebase.database().ref('helps').child(data.key).update({ pushUps: pushUps + 1 }, () => {
      console.log('updated');
    });
  }

  render() {
    const { data } = this.props;
    const {
      description, noPeople, title, distance, timeStamp
    } = data;
    const {
      pushUps
    } = this.state;
    return (
      <View style={{
        margin: 10,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row'
      }}
      >
        <View style={{
          flex: 1
        }}
        >
          <Icon name="rocket" size={30} color="#900" />
        </View>
        <View style={{
          flex: 5,
          borderColor: FLAG_COLOR_ORANGE,
          borderWidth: 1,
          borderLeftWidth: 5,
          borderRadius: 5,
          margin: 5,
        }}
        >
          <HelpDescription data={{
            title,
            description,
            noPeople,
            distance
          }}
          />
          <HelpRequestFooter pushUps={pushUps} handlePush={() => this.handlePush()} />
          <Time time={timeStamp} />
        </View>
      </View>
    );
  }
}

export default HelpRequest;
