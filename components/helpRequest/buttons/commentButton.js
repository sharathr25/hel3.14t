import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
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
        <TouchableOpacity style={[styles.container,{backgroundColor:FLAG_COLOR_WHITE}]} onPress={this.handleComment}>
          <Icon name="comment-alt" color={FLAG_COLOR_ORANGE} size={20} />
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
      backgroundColor: FLAG_COLOR_WHITE,
      borderWidth: 1,
      borderColor: FLAG_COLOR_ORANGE,
      margin: 3,
      borderRadius: 5,
      padding: 10
    },
    text:{
        fontSize: 15,
        color: FLAG_COLOR_ORANGE,
        paddingLeft: 5,
    },
  });