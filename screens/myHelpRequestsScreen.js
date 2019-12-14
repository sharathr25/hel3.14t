import React, { Component } from 'react';
import { FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import HelpRequestRequestedUsers from '../components/helpRequest/userAsRequester/helpRequestUserRequested';
import HelpingRequest from '../components/helpRequest/userAsHelper/helpingRequest';
import HelpRequestCompleted from '../components/helpRequest/userAsRequester/helpRequestCompleted';
import HelpingRequestCompleted from '../components/helpRequest/userAsHelper/helpingRequestCompleted';
import { firebaseOnEventListner, getDataFromFirebase, firebaseOnEventListnerTurnOff } from '../fireBase/database';

class MyHelpRequestsScreen extends Component {
    constructor(){
        super();
        this.uid = firebase.auth().currentUser.uid;
        this.state = {
            helpRequests: []
        }
    }

    addToHelpRequests = async (data) => {
        const key = data.val();
        const dbTogetHelps = (this.props.db === "helpingCompleted" || this.props.db === "helpRequetsCompleted") ? "helped" : "helps"
        const tempHelpRequest = await getDataFromFirebase(`${dbTogetHelps}/${key}`);
        const newHelprequest = {...tempHelpRequest.val(), key:key, distance:0};
        this.setState({helpRequests:[newHelprequest,...this.state.helpRequests]});
    }

    removeFromHelpRequests = (data) => {
        const newnewHelprequests = this.state.helpRequests.filter((datum) => datum.key !== data.val());
        this.setState({ helpRequests: newnewHelprequests });
    }

    componentDidMount() {
        firebaseOnEventListner(`users/${this.uid}/${this.props.db}`,'child_added', this.addToHelpRequests);
        firebaseOnEventListner(`users/${this.uid}/${this.props.db}`, 'child_removed', this.removeFromHelpRequests)
    }

    componentWillUnmount(){
        firebaseOnEventListnerTurnOff(`users/${this.uid}/${this.props.db}`);
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
