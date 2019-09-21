import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MyHelpRequestsScreen from './myHelpRequestsScreen';
import { ScrollView } from 'react-native-gesture-handler';
import { FONT_FAMILY, FLAG_COLOR_ORANGE } from '../constants/styleConstants';


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
                <Text style={styles.header}>Your requested helps</Text>
                <MyHelpRequests />
            </View>
            <View>
               <Text style={styles.header}>Currently helping</Text>
               <IAmHelping />
            </View>
            <View>
               <Text style={styles.header}>Your requested helps completed</Text>
               <MyHelpRequestsCompleted />
            </View>
            <View>
               <Text style={styles.header}>Helps which you have done already</Text>
               <IAmHelpingCompleted />
            </View>
        </ScrollView>
    );
  }
}

export default HelpsScreen;

const styles = StyleSheet.create({
    header:{
        fontFamily:FONT_FAMILY,
        fontSize:20,
        textAlign:'center'
    }
});
