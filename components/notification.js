import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import firebase from 'react-native-firebase';
import Icon from "react-native-vector-icons/Entypo";
import { FLAG_COLOR_WHITE } from "../constants/styleConstants";
import { TouchableOpacity } from "react-native-gesture-handler";

class Notification extends Component {
    constructor(props){
        super(props);
        this.uid = firebase.auth().currentUser.uid;
        this.state = {
            notifications: []
        }
    }

    componentDidMount(){
        firebase.database().ref('users').child(this.uid).child('notifications').on('child_added', data => {
            this.setState({notifications:[{key:data.key,...data.val()},...this.state.notifications]});
            console.log(this.state);
        });
    }

    handleBellIconClick = () => {
        this.props.navigation.navigate('Notifications',{notifications:[...this.state.notifications]});
    }

    render() {
        const { notifications } = this.state;
        return (
            <TouchableOpacity onPress={this.handleBellIconClick} style={styles.container}>
                <Icon name="bell" size={25} color={FLAG_COLOR_WHITE} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{notifications.length}</Text>
                </View>
            </TouchableOpacity>
        );
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
        right: 15
    },
    text:{
        fontSize: 10,
        color: FLAG_COLOR_WHITE,
    }
});
