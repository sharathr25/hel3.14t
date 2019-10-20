import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import { Text, View, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import { updateFirebase, notifyUser, pushToFirebase, removeFromFirebase, getDataFromFirebase, pushToFirebaseWithURL } from '../../../fireBase/database';
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE, FONT_FAMILY } from '../../../constants/styleConstants';
import Requester from './requester';
import DoneButton from '../buttons/doneButton';
import AccetedUser from '../common/acceptedUser';
import Card from '../../common/card';

class HelpRequestRequestedUsers extends Component {
    constructor(props){
        super(props);
        const { data } = this.props;
        this.key = data.key;
        this.helps = firebase.database().ref('helps');
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
        this.setState({usersRequested : [{uidOfRequestingHelper,name:data1.val().name, email:data1.val().email, mobileNumber:data1.val().mobileNumber, xp:data1.val().xp}, ...this.state.usersRequested]});
      },(err) => console.log(err));
      this.usersAccepted.on('child_added', async (data) => {
        const uidOfAcceptedHelper = data.val();
        const url = `users/${uidOfAcceptedHelper}`;
        const data2 = await getDataFromFirebase(url);
        this.setState({usersAccepted : [{uidOfAcceptedHelper,name:data2.val().name, email:data2.val().email, mobileNumber:data2.val().mobileNumber, xp:data2.val().xp}, ...this.state.usersAccepted]});
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
        const {name, uidOfRequestingHelper, xp} = datum;
        return <Requester name={name} uid={uidOfRequestingHelper} key={key} handleAccept={(uid) => this.handleAccept(uid)} handleReject={(uid) => this.handleReject(uid)} xp={xp} slNo={key+1}/>
      });
    }

    getAcceptedUsers = () => {
      const { usersAccepted } = this.state;
      return usersAccepted.map((datum, key) => {
        const {name, uidOfAcceptedHelper, email, mobileNumber, xp} = datum;
        return <AccetedUser name={name} uid={uidOfAcceptedHelper} key={key} mobileNumber={mobileNumber} xp={xp} slNo={key+1}/>
      });
    }

    handleAccept = (helperUid) => {
      const { noPeopleAccepted } = this.state;
      this.usersAccepted.orderByValue(helperUid).equalTo(helperUid).limitToFirst(1).once('value', async data => {
        if(!data.val()){
          updateFirebase(this.helpRequest,"noPeopleAccepted",noPeopleAccepted+1);
          await pushToFirebase(this.usersAccepted,helperUid);
          await pushToFirebaseWithURL(`users/${helperUid}/helping`,this.key);
          await removeFromFirebase(this.usersRequested,helperUid);
          await notifyUser(helperUid,{type:"ACCEPT", screenToRedirect:"Helped", uidOfHelper:helperUid,timeStamp: new Date().getTime(), idOfHelpRequest: this.key});
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
          await notifyUser(helperUid,{type:"REJECT", screenToRedirect:"NONE", uidOfHelper:helperUid,timeStamp: new Date().getTime(), idOfHelpRequest: this.key});
        } else {
          Alert.alert("user already rejected");
        }
      });
    }

  render() {
    const { data } = this.props;
    const { description, timeStamp } = data;
    return (
        <Card>
          <HelpDescription data={{ description }} />
          {this.state.usersRequested.length !== 0 && <View style={{margin: 10}}>
          <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People Willing to help you</Text>
          <Text>you can accept them by clicking Accept or you can reject them by clicking Reject</Text>
            {this.getRequestedUsers()}
          </View>}
          {this.state.usersAccepted.length !== 0 && <View style={{margin: 10}}>
          <Text style={{fontFamily: FONT_FAMILY, marginBottom: 5}}>People who are helping</Text>
            {this.getAcceptedUsers()}
          </View>}
          <DoneButton keyOfHelpRequest={this.key} data={data}/>
          <Time time={timeStamp} />
        </Card>
    );
  }
}

export default HelpRequestRequestedUsers;

const styles = StyleSheet.create({
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
  },
  acceptedUsersContainer: {
    flex: 1
  },
  accpetedUserscontainer:{
    flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      borderColor:FLAG_COLOR_ORANGE,
      borderBottomWidth: 1
  }
});

