import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff, pushToFirebaseWithURL, getDataFromFirebase, updateFirebaseWithURL } from '../../fireBase/database';
import { ORANGE, FONT_FAMILY } from '../../constants/styleConstants';
import firebase from 'react-native-firebase';
import Time from '../../components/common/time';
import  Icon from 'react-native-vector-icons/FontAwesome';

class Comments extends Component {
    static navigationOptions = {
        title: 'Comments',
        headerRight:null
    };

    constructor(props){
        super(props);
        this.uid = firebase.auth().currentUser && firebase.auth().currentUser.uid;
        this.state = {
            comments : [],
            comment:"",
            commentsCount:0,
            helpRequestKey:this.props.navigation.getParam('helpRequestKey')
        }
    }

    updateState = (data) => {
        if(data.key!=="comments"){
            this.setState( { [data.key]: data.val() })
        }
    }

    comment = async () => {
        const user = await getDataFromFirebase(`users/${this.uid}`);
        if(!this.state.comment)return;
        const commentData = {
            uidOfCommenter:this.uid,
            nameOfCommenter:user.val().name,
            timeStamp:new Date().getTime(),
            comment:this.state.comment
        }
        const helpRequestKey = this.props.navigation.getParam('helpRequestKey');
        await updateFirebaseWithURL(`helped/${helpRequestKey}`,"commentsCount", this.state.commentsCount+1);
        await pushToFirebaseWithURL(`helped/${helpRequestKey}/comments`,commentData);
        this.setState({comment:""});
    }

    addCommentToState = (data) => {
        this.setState({comments:this.state.comments.concat(data.val())})
    }

    componentDidMount(){
        const {helpRequestKey} = this.state;
        const commentsCountSnapShot = getDataFromFirebase(`helped/${helpRequestKey}/commentsCount`);
        commentsCountSnapShot.then((value) => {
            this.setState({commentsCount:value.val()});
        });
        firebaseOnEventListner(`helped/${helpRequestKey}/comments`, "child_added" ,this.addCommentToState)
        firebaseOnEventListner(`helped/${helpRequestKey}`, "child_changed" ,this.updateState)    
    }

    componentWillUnmount(){
        const {helpRequestKey} = this.state;
        firebaseOnEventListnerTurnOff(`helped/${helpRequestKey}/comments`);
        firebaseOnEventListnerTurnOff(`helped/${helpRequestKey}`);
    }

    getComments = () => {
        return this.state.comments.map((item,index) => {
            return (
                <View style={{margin:5, borderBottomWidth:1, borderColor:'#f6f6f6'}} key={index}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontFamily:FONT_FAMILY, color:'black'}}>{item.nameOfCommenter}</Text>
                    <View style={{justifyContent:"flex-end"}}>
                        <Time time={item.timeStamp} />
                    </View>
                    </View>
                    <Text>{item.comment}</Text>
                </View>
            )
        });
        
    }

    render() {
        return (
            <View style={{flex:1}}>
                <KeyboardAwareScrollView scrollEnabled={true} resetScrollToCoords={{ x: 0, y: 0 }} style={{flex:5}}>
                    {this.getComments()}
                </KeyboardAwareScrollView>
                <View style={styles.container}>
                {/* Comment input field */}
                    <TextInput
                        placeholder="Add a comment..."
                        keyboardType="twitter" // keyboard with no return button
                        autoFocus={true} // focus and show the keyboard
                        style={styles.input}
                        value={this.state.comment}
                        onChangeText={(value) => {this.setState({comment:value})}} // handle input changes
                    />
                    {/* Post button */}
                    <TouchableOpacity style={styles.button} onPress={this.comment}>
                        {/* Apply inactive style if no input */}
                        <Text style={[styles.text, !this.state.comment ? styles.inactive : []]}>Post <Icon name="send" /></Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
  }
}

export default Comments;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 15,
        flex:0.1
      },
      input: {
        flex: 1,
        height: 40,
        fontSize: 15,
      },
      button: {
        height: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      inactive: {
        color: '#CCC',
      },
      text: {
        color: ORANGE,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        fontSize: 15,
      },
});
