import React, { Component } from "react";
import { View, StyleSheet,Text } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import { getUser, firebaseOnEventListner, firebaseOnEventListnerTurnOff } from "../../../fireBase/database";
import AccetedUser from "../common/acceptedUser";
// import Icon from 'react-native-vector-icons/FontAwesome';
import Card from "../../common/card";
// import PostButton from '../buttons/postButton'; disabling POST feture for now

class HelpRequestCompleted extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.state = {
        helpers:[],
        showHelpRequests: false
    }
  }

  updateState = (data) => {
    this.setState( { [data.key]: data.val() })
  }

  addToHelpers = async (data) => {
    if(data.val()){ // we should not push if the helper is same as the current user i.e data.val() === this.uid
      uidOfUser = data.val();
      const user = await getUser(data.val());
      this.setState({ helpers: [...this.state.helpers,{...user.val(),uidOfHelper:uidOfUser}]});
    }
  }

  componentDidMount() {
    firebaseOnEventListner(`${this.props.db}/${this.key}`,'child_changed', this.updateState);
    firebaseOnEventListner(`${this.props.db}/${this.key}/usersAccepted`,'child_added',this.addToHelpers);
  }
  
  componentWillUnmount(){
      firebaseOnEventListnerTurnOff(`${this.props.db}/${this.key}`);
      firebaseOnEventListnerTurnOff(`${this.props.db}/${this.key}/usersAccepted`);
  }

getHelpers = () => {
    const { helpers } = this.state;
    return helpers.map((datum, key) => {
        const {name, uidOfHelper, email, mobileNumber, xp} = datum;
        return <AccetedUser name={name} uid={uidOfHelper} email="" key={key} mobileNumber="" xp={xp} slNo={key+1} />
    });
}

  render() {

    const { data,title } = this.props;
    const { description } = data;
    return (
      <Card>
          <HelpDescription data={{description}}/>
          {this.state.helpers.length !== 0 && 
            <View style={styles.container}>
              <Text>{title}</Text>
              {this.state.helpers.length !== 0 ? <View>{this.getHelpers()}</View> : <Text>This help request got closed without any helpers</Text>}
              {/* disbling post option for now */}
              {/* <PostButton keyOfHelpRequest={this.key} /> */} 
            </View>
          }
      </Card>
    );
  }
}

export default HelpRequestCompleted;

const styles = StyleSheet.create({
  container: {
    marginLeft: 10, marginBottom:10
  }
});
