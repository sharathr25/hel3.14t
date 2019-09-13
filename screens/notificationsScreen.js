import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FLAG_COLOR_ORANGE } from '../constants/styleConstants';

const types = {
    REQUEST : "Helper is willing to help you, please click to check",
    ACCEPT : "You got accepted to help, please go and help. All the best",
    REJECT : "You got rejected"
}
class NotificationsScreen extends Component {
    static navigationOptions = {
        title: 'Notifications'
    };

    navigateToScreen = (screenToRedirect) => {
        if(screenToRedirect === "NONE")return;
        this.props.navigation.navigate(screenToRedirect)
    }

    getNotification = ({item}) => {
        return (
            <TouchableOpacity style={styles.notificationContainer} onPress={() => {this.navigateToScreen(item.screenToRedirect)}}>
                <Text style={{fontSize: 20}}>{types[item.type]}</Text>
            </TouchableOpacity>);
    }
    render() {
        return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: FLAG_COLOR_ORANGE,
        padding: 5,
        borderRadius: 5
    }
});
