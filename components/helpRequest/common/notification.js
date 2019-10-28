import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import firebase from 'react-native-firebase';
import Icon from "react-native-vector-icons/AntDesign";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import { TouchableOpacity } from "react-native-gesture-handler";

class Notification extends Component {
    constructor(props){
        super(props);
        this.uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
        this.state = {
            notifications: []
        }
    }

    componentDidMount(){
        if(this.uid){
            firebase.database().ref('users').child(this.uid).child('notifications').on('child_added', data => {
                this.setState({notifications:[{key:data.key,...data.val()},...this.state.notifications]});
                if(data.val().type === "REQUEST"){ 
                    firebase.database().ref('helps').child(data.val().idOfHelpRequest).child('usersAccepted').on('child_added', user => {
                        if(user.val() === data.val().uidOfHelper){
                            firebase.database().ref('users').child(this.uid).child('notifications').child(data.key).remove();
                        }
                    });  
                    firebase.database().ref('helps').child(data.val().idOfHelpRequest).child('usersRejected').on('child_added', user => {
                        if(user.val() === data.val().uidOfHelper){
                            firebase.database().ref('users').child(this.uid).child('notifications').child(data.key).remove();
                        }
                    });  
                }
            });
            firebase.database().ref('users').child(this.uid).child('notifications').on('child_removed', data => {
                const newNotifications = this.state.notifications.filter((datum) => datum.key !== data.key);
                this.setState({ notifications: newNotifications});
            });
        }
    }

    componentWillUnmount() {
        firebase.database().ref('users').child(this.uid).child('notifications').off();
    }

    handleBellIconClick = () => {
        this.props.navigation.navigate('Notifications',{notifications:[...this.state.notifications]});
    }

    render() {
        const { notifications } = this.state;
        return notifications.length 
                ?   <TouchableOpacity onPress={this.handleBellIconClick} style={styles.container}>
                        <Icon name="bells" size={25} color={FLAG_COLOR_ORANGE} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{notifications.length}</Text>
                        </View>
                    </TouchableOpacity> 
                : null;
    }
}

export default Notification;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 15
    },
    textContainer:{
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        position: 'relative',
        top: 5,
        right: 10
    },
    text:{
        fontSize: 10,
        color: FLAG_COLOR_WHITE,
    }
});
