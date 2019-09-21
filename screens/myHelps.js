import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MyHelpRequestsScreen from './myHelpRequestsScreen';
import { ScrollView } from 'react-native-gesture-handler';


const MyHelpRequests = () => {
    return <MyHelpRequestsScreen db="helpsRequested" />
}

const IAmHelping = () => {
    return <MyHelpRequestsScreen db="helping" />
}

const MyHelpRequestsCompleted = () => {
    return <MyHelpRequestsScreen db="helpRequetsCompleted" />
}

const IAmHelpingCompleted = () => {
    return <MyHelpRequestsScreen db="helpingCompleted" />
}

class HelpsScreen extends Component {
    render() {
        return (
        <ScrollView>
            <View>
                <Text style={{fontSize: 20}}>Your requested helps</Text>
                <MyHelpRequests />
            </View>
            <View>
               <Text style={{fontSize: 20}}>Currently helping</Text>
               <IAmHelping />
            </View>
            <View>
               <Text style={{fontSize: 20}}>Your requested helps completed</Text>
               <MyHelpRequestsCompleted />
            </View>
            <View>
               <Text style={{fontSize: 20}}>Helps which you have done already</Text>
               <IAmHelpingCompleted />
            </View>
        </ScrollView>
    );
  }
}

export default HelpsScreen;
