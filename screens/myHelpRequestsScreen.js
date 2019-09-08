import React, { Component } from 'react';
import { FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import HelpRequest from '../components/helpRequest/helpRequest';

class MyHelpRequestsScreen extends Component {
    static navigationOptions = {
        title: 'My Help Requests'
    };

    constructor(){
        super();
        this.state = {
            helpRequests: [],
            isLoading: true
        }
    }
    componentDidMount() {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).child('helpsRequested').on('child_added',(data) => {
            const key = data.val();
            firebase.database().ref('helps').child(key).once('value',(data) => {
                const newHelprequest = {...data.val(), key:key, distance:0};
                this.setState({helpRequests:[newHelprequest,...this.state.helpRequests]});
            },(err) => console.log(err));
        }, (err) => console.log(err));
    }

    componentWillMount(){
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).child('helpsRequested').off();
    }

    getHelpRequest = ({item}) => {
    const helpRequest = item;
    return (
            <HelpRequest data={helpRequest} key={helpRequest.key} disableFooter={false} type="USER" />
        );
    };

    render() {
        return (
            <FlatList
                data={this.state.helpRequests}
                renderItem={this.getHelpRequest}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
}

export default MyHelpRequestsScreen;
