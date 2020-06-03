
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Auth } from "aws-amplify";
import { ORANGE, WHITE, BLACK, LIGHTEST_GRAY } from '../../styles/colors';
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { FONT_SIZE_20 } from '../../styles/typography';

const { LOGIN, MY_ACCOUNT, CHANGE_PASSOWRD } = SCREEN_DETAILS; 

const Option = ({ iconName, text, onPress }) => {
    const sizeOfIcon = FONT_SIZE_20 + 10
    const { optionStyle } = styles;
    return (
        <TouchableOpacity onPress={onPress} style={optionStyle}>
            <Icon color={BLACK} name={iconName} size={sizeOfIcon} />
            <Text style={{color: BLACK, fontSize: FONT_SIZE_20, flex: 1, marginLeft: 10 }}>{text}</Text>
            <Icon color={ORANGE} name="trending-neutral" size={sizeOfIcon} />
        </TouchableOpacity>
    )
}

const MoreScreen = ({ navigation } : { navigation: Object }) => {

    const handleLogOut = async () => {
        await Auth.signOut();
        navigation.popToTop()
        navigation.replace(LOGIN.screenName);
    }

    return (
        <ScrollView style={{ backgroundColor: WHITE }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, margin: 10 }}>
                <Option 
                    text="Account Details" 
                    iconName="account-box" 
                    onPress={() => navigation.navigate(MY_ACCOUNT.screenName)}
                />
                <Option 
                    text="Change Password" 
                    iconName="eye" 
                    onPress={() => navigation.navigate(CHANGE_PASSOWRD.screenName)}
                />
                <Option 
                    text="Settings" 
                    iconName="settings" 
                    onPress={() => {}}
                />
                <Option 
                    text="Terms & Conditions" 
                    iconName="file-check" 
                    onPress={() => {}}
                />
                <Option 
                    text="Privacy Policy" 
                    iconName="shield-lock-outline" 
                    onPress={() => {}}
                />
                <Option 
                    text="Refer" 
                    iconName="account-group" 
                    onPress={() => {}}
                />
                <Option 
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
    optionStyle : {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 10, 
        flex: 1, 
        backgroundColor: LIGHTEST_GRAY, 
        padding: 10
    }
});
