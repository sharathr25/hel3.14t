import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, View, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import HelpDescription from "./helpDescription";
import Time from "../time";
import { updateHelpRequest, notifyUser } from '../../fireBase/database';
import { FLAG_COLOR_GREEN, FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../../constants/styleConstants';

class Requester extends Component {
  handleAccept = () => {
    this.props.handleAccept(this.props.uid)
  }

  handleReject = () => {
    this.props.handleReject(this.props.uid)
  }

  render(){
   return <View style={styles.requestedUserDetailsContaner}>
      <Text>{this.props.name}</Text>
      <Text>{this.props.email}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.accept} onPress={this.handleAccept}><Text style={styles.text}>Accept</Text></TouchableOpacity>
        <TouchableOpacity style={styles.reject} onPress={this.handleReject}><Text style={styles.text}>Reject</Text></TouchableOpacity>
      </View>
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
    constructor(props){
        super(props);
        const { data } = this.props;
        this.key = data.key;
        this.helps = firebase.database().ref("/helps");
        this.helpRequest = this.helps.child(this.key);
        this.usersRequested = this.helpRequest.child("usersRequested");
        this.usersAccepted= this.helpRequest.child("usersAccepted");
        this.usersRejected = this.helpRequest.child("usersRejected");
        this.state = {
          noPeopleAccepted: data.noPeopleAccepted,
          usersRequested: [],
          usersAccepted: []
        }
    }

    componentDidMount(){
      this.helpRequest.on("child_changed", data => {
        this.setState( { [data.key]: data.val() })
      });
      this.usersRequested.on('child_added',(data) => {
        const uidOfRequestingHelper = data.val();
        firebase.database().ref('users').child(uidOfRequestingHelper).once('value',(data) => {
          this.setState({usersRequested : [{uidOfRequestingHelper,name:data.val().name, email:data.val().email}, ...this.state.usersRequested]});
        });
      },(err) => console.log(err));
      this.usersAccepted.on('child_added',(data) => {
        const uidOfAcceptedHelper = data.val();
        firebase.database().ref('users').child(uidOfAcceptedHelper).once('value',(data) => {
          this.setState({usersAccepted : [{uidOfAcceptedHelper,name:data.val().name, email:data.val().email}, ...this.state.usersAccepted]});
        });
      },(err) => console.log(err));
      this.usersRequested.on('child_removed',(data) => {
        const uidOfRequestingHelper = data.val();
        const newUsersRequested = this.state.usersRequested.filter((datum) => datum.uidOfRequestingHelper !== uidOfRequestingHelper);
        this.setState({usersRequested: newUsersRequested});
      },(err) => console.log(err));
      this.usersAccepted.on('child_removed',(data) => {
        const uidOfAcceptedHelper = data.val();
        const newUsersAccepted = this.state.usersAccepted.filter((datum) => datum.uidOfAcceptedHelper !== uidOfAcceptedHelper);
        this.setState({usersAccepted: newUsersAccepted});
      },(err) => console.log(err));
    }

    componentWillUnmount(){
      this.usersRequested.off();
      this.usersAccepted.off();
      this.helpRequest.off();
    }

    getRequestedUsers = () => {
      const { usersRequested } = this.state;
      return usersRequested.map((datum, key) => {
        const {name, uidOfRequestingHelper, email} = datum;
        return <Requester name={name} uid={uidOfRequestingHelper} email={email} key={key} handleAccept={(uid) => this.handleAccept(uid)} handleReject={(uid) => this.handleReject(uid)}/>
      });
    }

    getAcceptedUsers = () => {
      const { usersAccepted } = this.state;
      return usersAccepted.map((datum, key) => {
        const {name, uidOfAcceptedHelper, email} = datum;
        return <AccetedUser name={name} uid={uidOfAcceptedHelper} email={email} key={key} />
      });
    }

    removeUserAsRequested = (helperUid) => {
      this.usersRequested.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', data => {
        this.usersRequested.child(Object.keys(data.val())[0]).remove();
      });
    }
  
    handleAccept = (helperUid) => {
      const { noPeopleAccepted } = this.state;
      this.usersAccepted.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', data => {
        if(!data.val()){
          updateHelpRequest(this.helpRequest,"noPeopleAccepted",noPeopleAccepted+1, this.usersAccepted, helperUid);
          this.removeUserAsRequested(helperUid);
          notifyUser(helperUid,{type:"ACCEPT", screenToRedirect:"Helped", uidOfHelper:helperUid,timeStamp: new Date(), idOfHelpRequest: this.key});
        } else {
          Alert.alert("user already accepted");
        }
      });
    }
  
    handleReject = (helperUid) => {
      this.usersRejected.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', data => {
        if(!data.val()){
          this.usersRejected.push(helperUid).catch(err => {
            console.log(err);
          });
          this.removeUserAsRequested(helperUid);
          notifyUser(helperUid,{type:"REJECT", screenToRedirect:"NONE", uidOfHelper:helperUid,timeStamp: new Date(), idOfHelpRequest: this.key});
        } else {
          Alert.alert("user already rejected");
        }
      });
    }
    handleDone = () => {
      // TODO: remove from help requests set status Done, helpCompletedAt, move this helped queue
      Alert.alert("need to implement this");
    }

  render() {
    const { data } = this.props;
    const { description, title, distance, timeStamp } = data;
    return (
        <View style={styles.container}>
          <HelpDescription data={{ title, description, distance, type:"USER" }} />
          {this.state.usersRequested.length !== 0 && <>
          <Text>People Willing to help you</Text>
          {this.getRequestedUsers()}
          <Text>you can accept them by clicking Accept or you can reject them by clicking Reject</Text></>
          }
          {this.state.usersAccepted.length !== 0 && <Text>People who are helping</Text>}
          {this.getAcceptedUsers()}
          <TouchableOpacity style={styles.doneButton} onPress={this.handleDone}><Text style={styles.text}>Done</Text></TouchableOpacity>
          <Time time={timeStamp} />
        </View>
    );
  }
}

export default HelpRequestRequestedUsers;

const styles = StyleSheet.create({
  container:{
    margin: 5,
    backgroundColor:"#f6f6f6"
  },
  doneButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: FLAG_COLOR_ORANGE,
    borderWidth: 1,
    margin: 3,
    borderRadius: 5,
    padding: 5
  },
  accept:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: FLAG_COLOR_GREEN,
    borderWidth: 1,
    margin: 3,
    borderRadius: 5,
    padding: 5
  },
  reject:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: FLAG_COLOR_WHITE,
    borderColor: 'red',
    borderWidth: 1,
    margin: 3,
    borderRadius: 5,
    padding: 5
  },
  text:{
    fontSize: 20
  },
  requestedUserDetailsContaner:{
    flex: 1
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  }
});

