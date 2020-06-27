
import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, StyleProvider, Button, Thumbnail, View } from 'native-base';
import { ORANGE, WHITE } from '../../styles/colors';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { SCREEN_DETAILS } from '../../constants/appConstants';
import { padding } from "../../styles/mixins";
import { FONT_SIZE_20 } from "../../styles/typography";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

const { SIGNUP, LOGIN } = SCREEN_DETAILS;
const IMAGE_HEIGHT = 360;
const BUTTON_WIDTH_TO_CUT = 15;

const LandingScreen = ({ navigation }) => {
    const handleSignUp = () => {
        navigation.navigate(SIGNUP.screenName);
    }

    const handleSignIn = () => {
        navigation.navigate(LOGIN.screenName);
    }

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
        <StyleProvider style={getTheme(material)}>
            <Container style={{flex: 1}}>
                <Thumbnail
                    style={{ width: IMAGE_HEIGHT, height: IMAGE_HEIGHT }}
                    source={require('../../assets/Adobe_Post_20200305_0056150.7629810774930801.png')} 
                />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                    <Button rounded style={{ left: -BUTTON_WIDTH_TO_CUT }} onPress={handleSignUp}>
                        <Text style={{ fontSize: FONT_SIZE_20 }}>Register</Text>
                    </Button>
                    <Button rounded style={{ right: -BUTTON_WIDTH_TO_CUT }} onPress={handleSignIn}>
                        <Text style={{ fontSize: FONT_SIZE_20 }}> Login </Text>
                    </Button>
                </View>
            </Container>
        </StyleProvider>
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
