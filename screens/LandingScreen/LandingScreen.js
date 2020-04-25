// @flow
import React from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { SCREEN_DETAILS } from '../../constants/appConstants';
import { padding, borderRadius, margin } from "../../styles/mixins";
import { FONT_SIZE_20 } from "../../styles/typography";

const { SIGNUP, LOGIN } = SCREEN_DETAILS;

const LandingScreen = ({ navigation }: { navigation: Object}) => {
    const handleSignUp = () => {
        navigation.navigate(SIGNUP.screenName);
    }

    const handleSignIn = () => {
        navigation.navigate(LOGIN.screenName);
    }

    // const handleFacebookSignIn = () => {
    //     Alert.alert("need to implement facebook sign in");
    // }

    // const handleGoogleSignIn = () => {
    //     Alert.alert("need to implement facebook sign in");
    // }

    // const handleTwitterSignIn = () => {
    //     Alert.alert("need to implement facebook sign in");
    // }

    const {
        container,
        // appNameAndLogoContainer,
        // appName, 
        buttons,
        // socialMediaLoginButton,
        // socialMediaButtonText,
        // separater,
        // buttonContainerStyle,
        buttonText
    } = styles;

    const RegisterButton = () => (
        <TouchableOpacity onPress={handleSignUp} 
        style={{
            ...padding(10, 20, 10, 20),
            backgroundColor: ORANGE,
            ...borderRadius(0, 15, 15, 0),
            width: 120
        }}>
            <Text style={buttonText}>Register</Text>
        </TouchableOpacity>
    );

    const LoginButton = () => (
        <TouchableOpacity onPress={handleSignIn} 
            style={{
                ...padding(10, 20, 10, 20),
                backgroundColor: ORANGE,
                borderRadius: 15,
                ...borderRadius(15, 0, 0, 15),
                width: 120
            }}>
            <Text style={buttonText}>Login</Text>
        </TouchableOpacity>  
    )

    // const LoginWithFacebook = () => (
    //     <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#3b5998" }} onPress={handleFacebookSignIn}>
    //         <Icon name="facebook" color={WHITE} size={20} />
    //         <Text style={socialMediaButtonText}>
    //             Sign-in with Facebook
    //         </Text>
    //     </TouchableOpacity>
    // ) 

    // const LoginWithGoogle = () => (
    //     <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#4c8bf5" }} onPress={handleGoogleSignIn}>
    //         <Icon name="google" color={WHITE} size={20} />
    //         <Text style={socialMediaButtonText}>
    //             Sign-in with Google
    //         </Text>
    //     </TouchableOpacity>
    // );

    // const LoginWithTwitter = () => (
    //     <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#1DA1F2" }} onPress={handleTwitterSignIn}>
    //         <Icon name="twitter" color={WHITE} size={20} />
    //         <Text style={socialMediaButtonText}>
    //             Sign in with Twitter
    //         </Text>
    //     </TouchableOpacity>
    // );

    return (
        <View style={container}>
            <Image style={{ width: 360, height: 360, borderWidth: 1, alignSelf: "center", top: 30 }} source={require('../../assets/Adobe_Post_20200305_0056150.7629810774930801.png')} />    
            <View style={buttons}>
                {/* <LoginWithFacebook /> */}
                {/* <LoginWithGoogle /> */}
                {/* <LoginWithTwitter /> */}
                {/* <Text style={separater}>OR WITH EMAIL</Text> */}
                <View style={{flexDirection:'row', justifyContent: 'space-between', ...margin(0, 0, 40, 0)}}>
                    <RegisterButton />
                    <LoginButton />
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
        justifyContent: 'space-between'
    },
    appNameAndLogoContainer: {
        display: 'flex',
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
        ...padding(10, 20, 10, 20),
        backgroundColor: ORANGE,
        borderRadius: 15
    },
    buttonText: {
        textAlign: 'center',
        color: WHITE,
        fontSize: FONT_SIZE_20
    },
});

export default LandingScreen;
