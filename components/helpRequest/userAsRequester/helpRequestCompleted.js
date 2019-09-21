import React, { Component } from "react";
import { View, StyleSheet,Text } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import { getUser } from "../../../fireBase/database";
import AccetedUser from "../common/acceptedUser";
import Icon from 'react-native-vector-icons/FontAwesome';
import { FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";

class HelpRequestCompleted extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref(this.props.db);
    this.helpRequest = this.helps.child(this.key);
    this.state = {
        helpers:[],
        showHelpRequests: false
    }
  }

  componentDidMount() {
    this.helpRequest.on("child_changed", data => {
      this.setState( { [data.key]: data.val() })
    });
    this.helpRequest.child('usersAccepted').on('child_added',async data => {
        if(data.val()){ // we should not push if the helper is same as the current user i.e data.val() === this.uid
            uidOfUser = data.val();
            const user = await getUser(data.val());
            this.setState({ helpers: [...this.state.helpers,{...user.val(),uidOfHelper:uidOfUser}]});
        }
    });
  }
  
  componentWillUnmount(){
      this.helpRequest.off();
  }

getHelpers = () => {
    const { helpers } = this.state;
    return helpers.map((datum, key) => {
        const {name, uidOfHelper, email, mobileNumber, xp} = datum;
        return <AccetedUser name={name} uid={uidOfHelper} email="" key={key} mobileNumber="-" xp={xp} slNo={key+1} />
    });
}

  render() {

    const { data,title } = this.props;
    const { description } = data;
    return (
      <View style={styles.outerContanier}>
          <HelpDescription data={{description}}/>
          {this.state.helpers.length !== 0 && 
            <View style={{margin: 10}}>
            <Text>{title}</Text>
              <View style={styles.helpingUserscontainer}>
                <Icon style={{flex:1, textAlign: 'center'}} name="slack" size={20} color={FLAG_COLOR_ORANGE}/>
                <Icon style={{flex:4, textAlign: 'center'}} name="user-circle" size={20} color={FLAG_COLOR_ORANGE}/>
                <Icon style={{flex:1, textAlign: 'left'}} name="star" size={20} color={FLAG_COLOR_ORANGE}/>
                <Icon style={{flex:2, textAlign: 'center'}} name="mobile-phone" size={25} color={FLAG_COLOR_ORANGE}/>
              </View>
            <View>{this.getHelpers()}</View>
            </View>
          }
          
      </View>
    );
  }
}

export default HelpRequestCompleted;

const styles = StyleSheet.create({
  outerContanier: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#F6f6f6',
    elevation: 5
  },
  helpingUserscontainer:{
    flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      borderColor:FLAG_COLOR_ORANGE,
      borderBottomWidth: 1
  }
});
