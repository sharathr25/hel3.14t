import React, { Component } from 'react';
import { FlatList,Text } from 'react-native';
import firebase from 'react-native-firebase';
import HelpRequestRequestedUsers from '../components/helpRequest/userAsRequester/helpRequestUserRequested';
import HelpingRequest from '../components/helpRequest/userAsHelper/helpingRequest';
import { getDataFromFirebase } from '../fireBase/database';
import CompletedHelpRequest from '../components/helpRequest/feed/completedHelpRequest';
import HelpRequestCompleted from '../components/helpRequest/userAsRequester/helpRequestCompleted';
import HelpingRequestCompleted from '../components/helpRequest/userAsHelper/helpingRequestCompleted';

class MyHelpRequestsScreen extends Component {
    constructor(){
        super();
        this.state = {
            helpRequests: []
        }
    }
    componentDidMount() {
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).child(this.props.db).on('child_added',(data) => {
            const key = data.val();
            const dbTogetHelps = (this.props.db === "helpingCompleted" || this.props.db === "helpRequetsCompleted") ? "helped" : "helps"
            firebase.database().ref(dbTogetHelps).child(key).once('value',(data) => {
                const newHelprequest = {...data.val(), key:key, distance:0};
                this.setState({helpRequests:[newHelprequest,...this.state.helpRequests]});
            },(err) => console.log(err));
        }, (err) => console.log(err));
        firebase.database().ref('users').child(uid).child(this.props.db).on('child_removed',(data) => {
            const newnewHelprequests = this.state.helpRequests.filter((datum) => datum.key !== data.val());
            this.setState({ helpRequests: newnewHelprequests });
        }, (err) => console.log(err));
    }

    componentWillMount(){
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users').child(uid).child(this.props.db).off();
    }

    getHelpRequest = ({item}) => {
        const helpRequest = item;
        switch(this.props.db){
            case "helpsRequested":return <HelpRequestRequestedUsers data={helpRequest} key={helpRequest.key} />;
            case "helping":return <HelpingRequest data={helpRequest} key={helpRequest.key} db="helps" title="Helpers helping along with you"/>;
            case "helpRequetsCompleted":return <HelpRequestCompleted data={helpRequest} key={helpRequest.key} db="helped" title="Helpers who helped you"/>
            case "helpingCompleted":return <HelpingRequestCompleted data={helpRequest} key={helpRequest.key} db="helped" title="Helpers helped along with you"/>
            default: return null;
        }
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
