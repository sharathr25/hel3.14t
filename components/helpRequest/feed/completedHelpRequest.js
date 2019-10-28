import React, { Component } from "react";
import { View, StyleSheet,Image } from "react-native";
import firebase from "react-native-firebase";
import HelpDescription from "../common/helpDescription";
import LikeButton from "../buttons/likeButton";
import CommentButton from '../buttons/commentButton';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from "../../../fireBase/database";
import Card from "../../common/card";

class CompletedHelpRequest extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.key = data.key;
    this.uid = firebase.auth().currentUser.uid;
    this.helps = firebase.database().ref("/helped");
    this.helpRequest = this.helps.child(this.key);
    this.state = {
      images:[]
    }
  }

  addToImages = async (data) => {
    const imageUri = await firebase.storage().ref(`images/${data.val().image}`).getDownloadURL();
    this.setState({images: [...this.state.images,{key:data.key,imageUri:imageUri}]});
  }

  removeFromImages = async (data) => {
    console.log(data);
  }

  componentDidMount() {
    firebaseOnEventListner(`helped/${this.key}/posts`,"child_added",this.addToImages);
    firebaseOnEventListner(`helped/${this.key}/posts`,"child_removed",this.removeFromImages);
  }
  
  componentWillUnmount(){
    firebaseOnEventListnerTurnOff(`helped/${this.key}/posts`);
  }

  getImages = () => {
    return this.state.images.map((image,index) => {
      return <Image source={{uri:image.imageUri}} style={{minWidth: 200,
        height: 200}} key={index} />
    });
  }

  render() {
    const { data } = this.props;
    const { description } = data;
    return (
      <Card>
        <View style={styles.innerContaner}>
          <HelpDescription data={{description}} />
          {this.state.images.length !== 0 && this.getImages()}
          {
            !this.props.disableLike && 
            <View style={styles.buttons}>
              <LikeButton helpRequest={this.helpRequest} data={data}/>
              <CommentButton helpRequest={this.helpRequest} data={data}/>
            </View> 
          }
        </View>
      </Card>
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
