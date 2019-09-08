import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  Text, View, StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';

class Requester extends Component {
  handleAccept = () => {
    this.props.handleAccept(this.props.uid)
  }

  handleReject = () => {
    this.props.handleReject(this.props.uid)
  }

  render(){
   return <View>
      <Text>{this.props.name}</Text>
      <Text>{this.props.email}</Text>
      <Button title="Accept" onPress={this.handleAccept}/>
      <Button title="Reject" onPress={this.handleReject}/>
    </View>
  }
}

const AccetedUser = (props) => {
  return (
    <View>
      <Text>{props.name}</Text>
      <Text>{props.email}</Text>
    </View>
  );
}
class HelpRequestRequestedUsers extends Component {
    constructor(){
        super();
        this.state = {
          usersRequested: [],
          usersAccepted: []
        }
    }

    componentDidMount(){
      const { usersRequestedDb, usersAcceptedDb } = this.props;
      usersRequestedDb.on('child_added',(data) => {
        const uidOfRequestingHelper = data.val();
        firebase.database().ref('users').child(uidOfRequestingHelper).once('value',(data) => {
          this.setState({usersRequested : [{uidOfRequestingHelper,name:data.val().name, email:data.val().email}, ...this.state.usersRequested]});
        });
      },(err) => console.log(err));
      usersAcceptedDb.on('child_added',(data) => {
        const uidOfRequestingHelper = data.val();
        firebase.database().ref('users').child(uidOfRequestingHelper).once('value',(data) => {
          this.setState({usersAccepted : [{uidOfRequestingHelper,name:data.val().name, email:data.val().email}, ...this.state.usersAccepted]});
        });
      },(err) => console.log(err));
    }

    componentWillUnmount(){
      const { usersRequestedDb } = this.props;
      usersRequestedDb.off();
    }

    getRequestedUsers = () => {
      const { usersRequested } = this.state;
      return usersRequested.map((datum, key) => {
        const {name, uidOfRequestingHelper, email} = datum;
        return <Requester name={name} uid={uidOfRequestingHelper} email={email} key={key} handleAccept={(uid) => this.props.handleAccept(uid)} handleReject={(uid) => this.props.handleReject(uid)}/>
      });
    }

    getAcceptedUsers = () => {
      const { usersAccepted } = this.state;
      return usersAccepted.map((datum, key) => {
        const {name, uidOfRequestingHelper, email} = datum;
        return <AccetedUser name={name} uid={uidOfRequestingHelper} email={email} key={key} />
      });
    }

  render() {
    return (
        <View style={{borderWidth: 1, borderColor:"black"}}>
          {this.state.usersRequested.length !== 0 && <>
          <Text>People Willing to help you</Text>
          <Text>you can accept them by clicking Accept or you can reject them by clicking Reject</Text></>
          }
          {this.getRequestedUsers()}
          {this.state.usersAccepted.length !== 0 && <Text>People who are helping</Text>}
          {this.getAcceptedUsers()}
        </View>
    );
  }
}

export default HelpRequestRequestedUsers;

