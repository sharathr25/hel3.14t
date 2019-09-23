import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import Time from "../../common/time";
import LikeButton from "../buttons/likeButton";
import CommentButton from '../buttons/commentButton';

class CompletedHelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helped");
    this.helpRequest = this.helps.child(this.key);
  }

  componentDidMount() {
    this.helpRequest.on("child_changed", data => {
      this.setState( { [data.key]: data.val() })
    });
  }
  
  componentWillUnmount(){
      this.helpRequest.off();
  }

  render() {
    const { data } = this.props;
    const { description, timeStamp } = data;
    return (
      <View style={styles.outerContanier}>
        <View style={styles.innerContaner}>
          <HelpDescription data={{description}} />
          {
            !this.props.disableLike && 
            <View style={styles.buttons}>
              <LikeButton helpRequest={this.helpRequest} data={data}/>
              <CommentButton helpRequest={this.helpRequest} data={data}/>
            </View> 
          }
        </View>
      </View>
    );
  }
}

export default CompletedHelpRequest;

const styles = StyleSheet.create({
  outerContanier: {
    margin: 10,
    borderRadius: 5,
    flexDirection: "row",
    elevation: 5
  },
  innerContaner: {
    flex: 5,
    backgroundColor: "#F6F6F6",
    borderRadius: 5,
  },
  buttons:{
    flex: 1,
    flexDirection: "row",
    justifyContent:'space-evenly'
  }
});
