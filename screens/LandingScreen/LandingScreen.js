// @flow
import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Button from '../../components/common/button';
import { APP_TITLE } from '../../constants/appConstants';
import { Auth } from "aws-amplify";
import { CustomModal } from "../../components/molecules";
import Context from '../../context';

const LandingScreen = ({ navigation }: { navigation: Object}) => {
    const {initializing, user} = useContext(Context);;

    if(initializing) {
        return <CustomModal desc="Please wait" />
    }
 
    if(user) {
        navigation.replace('Main', { user } );
    }

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    }

    const handleSignIn = () => {
        navigation.navigate('Login');
    }

    const handleFacebookSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    const handleGoogleSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    const handleTwitterSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    const {
        container,
        appNameAndLogoContainer,
        appName, buttons,
        // socialMediaLoginButton,
        // socialMediaButtonText,
        // separater,
        buttonContainerStyle,
        buttonText
    } = styles;

    return (
        <View style={container}>
            <View style={appNameAndLogoContainer}>
                <Text style={appName}>{APP_TITLE}</Text>
            </View>
            <View style={buttons}>
                {/* <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#3b5998" }} onPress={handleFacebookSignIn}>
                    <Icon name="facebook" color={WHITE} size={20} />
                    <Text style={socialMediaButtonText}>
                        Sign-in with Facebook
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#4c8bf5" }} onPress={handleGoogleSignIn}>
                    <Icon name="google" color={WHITE} size={20} />
                    <Text style={socialMediaButtonText}>
                        Sign-in with Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#1DA1F2" }} onPress={handleTwitterSignIn}>
                    <Icon name="twitter" color={WHITE} size={20} />
                    <Text style={socialMediaButtonText}>
                        Sign in with Twitter
                    </Text>
                </TouchableOpacity>
                <Text style={separater}>OR WITH EMAIL</Text> */}
                <View>
                    <TouchableOpacity onPress={handleSignIn} style={buttonContainerStyle}>
                        <Text style={buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignUp} style={buttonContainerStyle}>
                        <Text style={buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

LandingScreen.navigationOptions = {
    title: "",
    headerLeft: null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        padding: 10
    },
    appNameAndLogoContainer: {
        display: 'flex',
        flex: 2.5,
        padding: 10
    },
    appName: {
        textAlign: 'left',
        fontFamily: "cursive",
        fontSize: 30,
        color: ORANGE
    },
    buttons: {
        display: 'flex',
        flex: 2,
        padding: 5,
    },
    socialMediaLoginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius: 3
    },
    socialMediaButtonText: {
        color: WHITE,
        paddingLeft: 10,
        fontSize: 20
    },
    separater: {
        textAlign: "center"
    },
    buttonContainerStyle: {
        margin: 10,
        padding: 10,
        backgroundColor: ORANGE,
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: WHITE,
        fontSize: 18
    },
});

export default LandingScreen;
