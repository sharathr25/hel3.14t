// @flow
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ORANGE, WHITE } from '../../styles/colors';
import { FullScreenError , FullScreenLoader} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useAuth } from "../../customHooks";

const { LOGIN, VERIFICATION } = SCREEN_DETAILS; 

const USER_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid){
            xp,
            stars
        }
    }
`;

type MyAccountScreenProps = {
    navigation: Object
}

const VerfifyButton = ({onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={{ borderColor: ORANGE, borderWidth: 1, color: ORANGE, padding: 5, margin: 5, borderRadius: 5 }}>
            Verify
        </Text>
    </TouchableOpacity>
);

const EmailVerifyMessage = ({handleVerify}) => (
    <View style={{ flexDirection: 'row', ...text, alignItems: 'center'}}>
        <Text>Email is not verified</Text>
        <VerfifyButton onPress={handleVerify} />
    </View>
);

const MyAccountScreen = (props: MyAccountScreenProps) => {
    const { navigation } = props;
    
    const [getUserData, { error, data, loading }] = useLazyQuery(USER_QUERY);
    const { user } = useAuth();
    useEffect(() => {
        if(user)
            getUserData({ variables: { uid : user.uid } })
    }, [user])

    if(!user) return <FullScreenLoader />

    const { uid, attributes } = user;
    const { name, email, phone_number: phoneNumber, email_verified } = attributes;

    const verify = async (otp) => {
        await Auth.verifyCurrentUserAttributeSubmit('email', otp)
    }

    const resend = async () => {
        return await Auth.verifyCurrentUserAttribute('email')
    }

    const redirectTo = async () => {
        await Auth.signOut();
        navigation.navigate(LOGIN.screenName);
    }

    const handleVerify = async () => {
    await Auth.verifyCurrentUserAttribute('email');
    const paramsForVerificationScreen = { verify, redirectTo, resend, message: "Enter OTP sent to registered email" };
    navigation.navigate(VERIFICATION.screenName, paramsForVerificationScreen);
  }

    const handleLogOut = () => {
        console.log(navigation);
    }

    if (loading || !uid) {
        return <FullScreenLoader />
    }
    if (error) {
        return <FullScreenError />
    }

    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");
    const firstLetterOfDisplayName = name.charAt(0).toUpperCase();

    const { xp = 0, stars = 0 } = data ? data.user : {};

    const { details, displayNameStyle, profileLetterContainer, profileLetter, text, xpContainerStyle, xpTextStyle, detailRow, icon, container } = styles;

    return (
        <View style={container}>
            <View style={profileLetterContainer}>
                <Text style={profileLetter}>{firstLetterOfDisplayName}</Text>
            </View>
            <Text style={displayNameStyle}>{name}</Text>
            <View style={details}>
                <View style={detailRow}>
                    <View style={icon}>
                        <Icon size={30} name="envelope-o" color={ORANGE} />
                    </View>
                    <View>
                        <Text style={text}>{email}</Text>
                        {!email_verified && <EmailVerifyMessage handleVerify={handleVerify} />}
                    </View>
                </View>
                <View style={detailRow}>
                    <View style={icon}>
                        <Icon size={30} name="phone" color={ORANGE} />
                    </View>
                    <Text style={text}>{phoneNumberWithoutCountryCode}</Text>
                </View>
                <View style={detailRow}>
                    <View style={xpContainerStyle}>
                        <Text style={xpTextStyle}>XP</Text>
                    </View>
                    <Text style={text}>{xp}</Text>
                </View>
                <View style={detailRow}>
                    <View style={icon}>
                        <Icon size={30} name="star-o" color={ORANGE} />
                    </View>
                    <Text style={text}>{stars}</Text>
                </View>
            </View>
        </View>
    );
}

export default MyAccountScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        display: 'flex',
        flex: 1,
        backgroundColor: WHITE
    },
    details: {
        alignItems: 'flex-start',
        flex: 1,

        marginLeft: 30,
        marginRight: 30
    },
    displayNameStyle: {
        fontWeight: 'bold',
        fontFamily: 'fantasy',
        fontSize: 30,
        color: '#000',
        margin: 5
    },
    profileLetterContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ORANGE,
        width: 200,
        height: 200,
        borderRadius: 100,
        position: 'relative',
        margin: 5
    },
    profileLetter: {
        color: WHITE,
        fontSize: 80
    },
    detailRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    text: {
        fontSize: 20,
        marginHorizontal: 10,
        color: "#000"
    },
    xpContainerStyle: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderColor: ORANGE,
        padding: 4,
        borderRadius: 5
    },
    xpTextStyle: {
        color: ORANGE,
        fontWeight: 'bold',
    },
    icon: {
        width: 30,
        height: 30
    }
});
