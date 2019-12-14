import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Time from '../components/common/time';

const types = {
    REQUEST : "Helper is willing to help you, please click to check",
    ACCEPT : "You got accepted to help, please go and help. All the best",
    REJECT : "You got rejected",
    CLOSED : "Request got closed" 
}
class NotificationsScreen extends Component {
    static navigationOptions = {
        title: 'Notifications',
        headerLeft: null
    };

    navigateToScreen = (screenToRedirect) => {
        if(screenToRedirect === "NONE")return;
        this.props.navigation.navigate(screenToRedirect)
    }

    getNotification = ({item}) => {
        return (
            <TouchableOpacity style={styles.notificationContainer} onPress={() => {this.navigateToScreen(item.screenToRedirect)}}>
                <Text style={{fontSize: 20, paddingLeft: 5}}>{types[item.type]}</Text>
                <Time time={item.timeStamp} />
            </TouchableOpacity>);
    }
    render() {
        return (
        <View>
            <FlatList
                data={this.props.navigation.state.params.notifications}
                renderItem={this.getNotification}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
  }
}

export default NotificationsScreen;

const styles = StyleSheet.create({
    notificationContainer: {
        flex:1,
        borderBottomWidth: 1,
        borderBottomColor:"#e3e3e3"
    }
});
