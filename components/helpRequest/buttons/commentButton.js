import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { WHITE, ORANGE } from "../../../constants/styleConstants";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../../../fireBase/database';
import { withNavigation } from 'react-navigation';

class CommentButton extends Component {
    constructor(props){
      super(props);
      const { data } = this.props;
      this.helpRequest = this.props.helpRequest;
      this.key = data.key;
      this.state = {
        commentsCount: data.commentsCount ? data.commentsCount : 0
      }
    }
  
    updateState = (data) => {
      this.setState( { [data.key]: data.val() })
    }

    componentDidMount() {
      firebaseOnEventListner(`helped/${this.key}`,"child_changed",this.updateState);
    }

    componentWillUnmount(){
      firebaseOnEventListnerTurnOff(`helped/${this.key}`);
    }

    handleComment = () => {
        this.props.navigation.navigate('comments',{helpRequestKey:this.key})
    }
    
    render(){
      const { commentsCount } = this.state;
      return (
        <TouchableOpacity style={[styles.container,{backgroundColor:WHITE}]} onPress={this.handleComment}>
          <Icon name="comment-alt" color={ORANGE} size={20} />
          <Text style={styles.text}>{commentsCount}</Text>
        </TouchableOpacity>
      );
    }
  }

  export default withNavigation(CommentButton);

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
    text:{
        fontSize: 15,
        color: ORANGE,
        paddingLeft: 5,
    },
  });