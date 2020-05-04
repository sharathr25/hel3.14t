// @flow
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ORANGE, WHITE, BLACK } from '../../styles/colors';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { FONT_SIZE_20 } from '../../styles/typography';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const { LOGIN, MY_ACCOUNT, CHANGE_PASSOWRD } = SCREEN_DETAILS; 

const ScreenNavigationOption = ({ iconName, text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20 }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon color={BLACK} style={{ marginRight: 20 }} name={iconName} size={FONT_SIZE_20 + 10}/>
                <Text style={{color: BLACK, fontSize: FONT_SIZE_20 }}>{text}</Text>
            </View>
            <Icon color={ORANGE} name="trending-neutral" size={FONT_SIZE_20 + 10} />
        </TouchableOpacity>
    )
}



const MoreScreen = ({ navigation } : { navigation: Object }) => {

    const handleLogOut = async () => {
        await Auth.signOut();
        navigation.popToTop()
        navigation.replace(LOGIN.screenName);
    }

    const { container } = styles
    return (
        <ScrollView style={{ backgroundColor: WHITE }}>
            <View style={container}>
                <ScreenNavigationOption 
                    text="Account Details" 
                    iconName="account-box" 
                    onPress={() => navigation.navigate(MY_ACCOUNT.screenName)}
                />
                <ScreenNavigationOption 
                    text="Change Password" 
                    iconName="eye" 
                    onPress={() => navigation.navigate(CHANGE_PASSOWRD.screenName)}
                />
                <ScreenNavigationOption 
                    text="Settings" 
                    iconName="settings" 
                    onPress={() => {}}
                />
                <ScreenNavigationOption 
                    text="Help & Feedback" 
                    iconName="help-circle-outline" 
                    onPress={() => {}}
                />
                <ScreenNavigationOption 
                    text="Terms & Conditions" 
                    iconName="file-check" 
                    onPress={() => {}}
                />
                <ScreenNavigationOption 
                    text="Privacy Policy" 
                    iconName="shield-lock-outline" 
                    onPress={() => {}}
                />
                <ScreenNavigationOption 
                    text="Refer" 
                    iconName="account-group" 
                    onPress={() => {}}
                />
                <ScreenNavigationOption 
                    text="Logout" 
                    iconName="logout-variant" 
                    onPress={handleLogOut}
                />
            </View>
        </ScrollView>
    );
}

export default MoreScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE, justifyContent: 'space-evenly', margin: 30
    }
});
