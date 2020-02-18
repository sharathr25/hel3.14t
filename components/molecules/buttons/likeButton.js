import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text , ActivityIndicator} from "react-native";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/AntDesign";
import { WHITE, ORANGE } from "../../../constants/styleConstants";
import { updateFirebase, removeFromFirebaseWithURl, firebaseOnEventListner, firebaseOnEventListnerTurnOff, pushToFirebaseWithURL, updateFirebaseWithURL } from '../../../fireBase/database';

export default class LikeButton extends Component {
    constructor(props){
      super(props);
      const {data } = this.props;
      this.uid = firebase.auth().currentUser && firebase.auth().currentUser && firebase.auth().currentUser.uid;
      this.key = data.key;
      this.state = {
        likes: data.likes,
        userLiked: false,
        likedUserKey: null,
        isLoading: false
      }
    }
  
    updateState = (data) => {
      this.setState( { [data.key]: data.val() })
    }

    componentDidMount() {
      firebaseOnEventListner(`helped/${this.key}`,"child_changed",this.updateState);
      this.setLikeStatus();
    }

    componentWillUnmount(){
      firebaseOnEventListnerTurnOff(`helped/${this.key}`);
    }

    handleLike = async () => {
      if(this.state.isLoading)return;
      this.setState({isLoading : true});
      const { likes,userLiked,likedUserKey } = this.state;
      if(!userLiked){
        updateFirebaseWithURL(`helps/${this.key}`,"likes", likes + 1);
        await pushToFirebaseWithURL(`helped/${this.key}/usersLiked`, this.uid)
      } else {
        updateFirebaseWithURL(`helps/${this.key}`,"likes", likes - 1);
        await removeFromFirebaseWithURl(`helped/${this.key}/usersLiked/${likedUserKey}`);
      }     
      this.setLikeStatus();
      this.setState({ isLoading : false });
    }
  
    setLikeStatus = async () => {
      const data = await firebase.database().ref(`helped/${this.key}/usersLiked`).orderByValue(this.uid).equalTo(this.uid).limitToFirst(1).once("value");
      if(data.val()){
        this.setState({ userLiked: true, likedUserKey: Object.keys(data.val())[0]});
      } else {
        this.setState({ userLiked: false, likedUserKey: null});
      }
    };
    
    render(){
      const { likes,userLiked, isLoading } = this.state;
      return (
        <TouchableOpacity style={[styles.container,{backgroundColor: userLiked ? WHITE:ORANGE}]} onPress={this.handleLike}>
          <Icon name="like1" color={userLiked ? ORANGE : WHITE} size={20} style={styles.likeIcon}/>
          <Text style={userLiked ? styles.textActive : styles.textInactive}>{likes}</Text>
          {isLoading && <ActivityIndicator color={userLiked?ORANGE:WHITE} />}
        </TouchableOpacity>
      );
    }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: ORANGE,
    margin: 3,
    borderRadius: 5,
    padding: 10
  },
  likeIconActive:{
  },
  likeIconInactive:{
  },
  textActive:{
      fontSize: 15,
      color: ORANGE
  },
  textInactive:{
    fontSize: 15,
    color: WHITE
  }
  });