import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ORANGE, WHITE } from '../constants/styleConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../components/common/button';
import { APP_TITLE } from '../constants/appConstants';

const LandingScreen = ({ navigation }) => {
    const { user, initializing } = useAuth();
    useEffect(() => {
        if (user) {
            navigation.replace('Main', { currentUser: user });
        }
    }, [initializing]);

    handleSignUp = () => {
        navigation.navigate('SignUp');
    }

    handleSignIn = () => {
        navigation.navigate('Login');
    }

    handleFacebookSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    handleGoogleSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    handleTwitterSignIn = () => {
        Alert.alert("need to implement facebook sign in");
    }

    const { container, appNameAndLogoContainer, appName, buttons, socialMediaLoginButton, socialMediaButtonText, separater } = styles;
    return (
        <View style={container}>
            <View style={appNameAndLogoContainer}>
                <Text style={appName}>{APP_TITLE}</Text>
            </View>
            <View style={buttons}>
                <TouchableOpacity style={{ ...socialMediaLoginButton, backgroundColor: "#3b5998" }} onPress={handleFacebookSignIn}>
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
                <Text style={separater}>OR WITH EMAIL</Text>
                <View style={{ flexDirection: "row", alignItems: 'center', alignSelf: 'stretch', justifyContent: 'center' }}>
                    <Button textColor={WHITE} bgColor={ORANGE} onPress={handleSignUp}>Sign up</Button>
                    <Button textColor={WHITE} bgColor={ORANGE} onPress={handleSignIn}>Sign in</Button>
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
    }
});

export default LandingScreen;
