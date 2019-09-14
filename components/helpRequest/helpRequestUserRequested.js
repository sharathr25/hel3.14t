import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, View, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import HelpDescription from "./helpDescription";
import Time from "../time";
import { updateFirebase, notifyUser, pushToFirebase, removeFromFirebase, getDataFromFirebase } from '../../fireBase/database';
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from '../../constants/styleConstants';
import Requester from '../requester';

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
      this.usersRequested.on('child_added',async (data) => {
        const uidOfRequestingHelper = data.val();
        const url = `users/${uidOfRequestingHelper}`;
        const data1 = await getDataFromFirebase(url);
        this.setState({usersRequested : [{uidOfRequestingHelper,name:data1.val().name, email:data1.val().email}, ...this.state.usersRequested]});
      },(err) => console.log(err));
      this.usersAccepted.on('child_added', async (data) => {
        const uidOfAcceptedHelper = data.val();
        const url = `users/${uidOfAcceptedHelper}`;
        const data2 = await getDataFromFirebase(url);
        this.setState({usersAccepted : [{uidOfAcceptedHelper,name:data2.val().name, email:data2.val().email}, ...this.state.usersAccepted]});
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

    handleAccept = (helperUid) => {
      const { noPeopleAccepted } = this.state;
      this.usersAccepted.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', async data => {
        if(!data.val()){
          updateFirebase(this.helpRequest,"noPeopleAccepted",noPeopleAccepted+1);
          await pushToFirebase(this.usersAccepted,helperUid);
          await removeFromFirebase(this.usersRequested,helperUid);
          await notifyUser(helperUid,{type:"ACCEPT", screenToRedirect:"Helped", uidOfHelper:helperUid,timeStamp: new Date(), idOfHelpRequest: this.key});
        } else {
          Alert.alert("user already accepted");
        }
      });
    }
  
    handleReject = (helperUid) => {
      this.usersRejected.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', async data => {
        if(!data.val()){
          await pushToFirebase(this.usersRejected, helperUid)
          await removeFromFirebase(this.usersRequested,helperUid);
          await notifyUser(helperUid,{type:"REJECT", screenToRedirect:"NONE", uidOfHelper:helperUid,timeStamp: new Date(), idOfHelpRequest: this.key});
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
  text:{
    fontSize: 20
  }
});

