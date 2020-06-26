
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Auth } from "aws-amplify";
import { ORANGE, WHITE, BLACK, LIGHTEST_GRAY } from '../../styles/colors';
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { FONT_SIZE_20 } from '../../styles/typography';
import { StyleProvider, Container, Content, List, ListItem, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const { LOGIN, MY_ACCOUNT, CHANGE_PASSOWRD } = SCREEN_DETAILS; 

const Option = ({ iconName, text, onPress }) => {
    const sizeOfIcon = FONT_SIZE_20 + 10
    const { optionStyle } = styles;
    return (
        <ListItem noBorder onPress={onPress} style={optionStyle}>
            <Icon style={{ color: BLACK }} name={iconName} size={sizeOfIcon} />
            <Text style={{color: BLACK, fontSize: FONT_SIZE_20, flex: 1, marginLeft: 10 }}>{text}</Text>
            <Icon style={{ color: ORANGE }} name="ios-arrow-forward" size={sizeOfIcon} />
        </ListItem>
    )
}

const MoreScreen = ({ navigation }) => {

    const handleLogOut = async () => {
        await Auth.signOut();
        navigation.popToTop()
        navigation.replace(LOGIN.screenName);
    }

    return (
        <StyleProvider style={getTheme(material)}>
            <Container>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <List style={{ flex:1 , justifyContent: 'space-evenly' }}>
                        <Option 
                            text="Account Details" 
                            iconName="ios-contact" 
                            onPress={() => navigation.navigate(MY_ACCOUNT.screenName)}
                        />
                        <Option 
                            text="Change Password" 
                            iconName="ios-eye" 
                            onPress={() => navigation.navigate(CHANGE_PASSOWRD.screenName)}
                        />
                        <Option 
                            text="Settings" 
                            iconName="ios-settings" 
                            onPress={() => {}}
                        />
                        <Option 
                            text="Terms & Conditions" 
                            iconName="ios-paper" 
                            onPress={() => {}}
                        />
                        <Option 
                            text="Privacy Policy" 
                            iconName="ios-glasses" 
                            onPress={() => {}}
                        />
                        <Option 
                            text="Refer" 
                            iconName="md-people" 
                            onPress={() => {}}
                        />
                        <Option 
                            text="Logout" 
                            iconName="ios-log-out" 
                            onPress={handleLogOut}
                        />
                    </List>
                </Content>
            </Container>
        </StyleProvider>
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
        padding: 10,
    }
});
