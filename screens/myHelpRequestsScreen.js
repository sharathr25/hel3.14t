import React, { Component } from 'react';
import { FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import HelpRequestRequestedUsers from '../components/helpRequest/helpRequestUserRequested';

class MyHelpRequestsScreen extends Component {
    static navigationOptions = {
        title: 'My Help Requests'
    };

    constructor(){
        super();
        this.state = {
            helpRequests: []
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
        firebase.database().ref('users').child(uid).child('helpsRequested').on('child_removed',(data) => {
            const newnewHelprequests = this.state.helpRequests.filter((datum) => datum.key !== data.val());
            this.setState({ helpRequests: newnewHelprequests });
        }, (err) => console.log(err));
    }

    componentWillMount(){
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).child('helpsRequested').off();
    }

    getHelpRequest = ({item}) => {
    const helpRequest = item;
    return (
            <HelpRequestRequestedUsers data={helpRequest} key={helpRequest.key} />
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
