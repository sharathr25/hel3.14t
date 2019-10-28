import React, { Component } from "react";
import { View, StyleSheet,Text } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import { getUser, firebaseOnEventListner, firebaseOnEventListnerTurnOff } from "../../../fireBase/database";
import AccetedUser from "../common/acceptedUser";
import Icon from 'react-native-vector-icons/FontAwesome';
import { FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import Card from "../../common/card";

class HelpingRequest extends Component {
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

  addToHelpers = async (data) => {
    if(data.val()){ // we should not push if the helper is same as the current user i.e data.val() === this.uid
      uidOfUser = data.val();
      const user = await getUser(data.val());
      this.setState({ helpers: [...this.state.helpers,{...user.val(),uidOfHelper:uidOfUser}]});
    }
  }

  updateState = (data) => {
      this.setState( { [data.key]: data.val() })
  }

  componentDidMount() {
    firebaseOnEventListner(`${this.props.db}/${this.key}`,'child_changed', this.updateState);
    firebaseOnEventListner(`${this.props.db}/${this.key}/usersAccepted`, 'child_added', this.addToHelpers);
  }
  
  componentWillUnmount(){
      firebaseOnEventListnerTurnOff(`${this.props.db}/${this.key}`);
      firebaseOnEventListnerTurnOff(`${this.props.db}/${this.key}/usersAccepted`);
  }

getHelpers = () => {
    const { helpers } = this.state;
    return helpers.map((datum, key) => {
        const {name, uidOfHelper, email, mobileNumber, xp} = datum;
        return <AccetedUser name={name} uid={uidOfHelper} email="" key={key} mobileNumber="" xp={xp} />
    });
}

  render() {

    const { data,title } = this.props;
    const { description } = data;
    return (
      <Card>
          <HelpDescription data={{description}}/>
          {this.state.helpers.length !== 0 && 
            <View style={{marginLeft: 10, marginBottom:10}}>
              <Text>{title}</Text>
              <View>{this.getHelpers()}</View>
            </View>
          }
      </Card>
    );
  }
}

export default HelpingRequest;

const styles = StyleSheet.create({
  helpingUserscontainer:{
    flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      borderColor:FLAG_COLOR_ORANGE,
      borderBottomWidth: 1
  }
});
