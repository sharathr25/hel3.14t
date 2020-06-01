// @flow
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { ORANGE, WHITE, BLACK, LIGHTEST_GRAY } from '../../styles/colors';
import { ProfileLetter, Button, Link, Toast} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useAuth } from "../../customHooks";
import { FONT_BOLD, FONT_SIZE_20 } from '../../styles/typography';
import { CustomModal, OTPVerificationToast } from '../../components/molecules';
import { toastTypes } from '../../components/atoms/Toast';
import { POLL_INTERVAL } from '../../config';
import { getRatings } from '../../utils';

const { UPDATE_ACCOUNT } = SCREEN_DETAILS; 

const USER_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid){
            xp,
            stars,
            totalRaters,
        }
    }
`;

type MyAccountScreenProps = {
    navigation: Object
}

type DetailProps = {
    label: string,
    value: string,
    showSeparator?: boolean,
    subDetail?: any,
}

const EmailVerifyMessage = ({handleVerify}:{ handleVerify: Function}) => (
    <View style={{ flexDirection: 'row' }}>
        <Text>Email is not verified - </Text>
        <Link onPress={handleVerify}>Verify</Link>
    </View>
);

const Detail = ({ label, value, showSeparator = true, subDetail = undefined }: DetailProps) => {
    return (
        <View style={{ flex: 1, borderBottomWidth: showSeparator ? 0.5 : 0, justifyContent: 'center' }}>
            <Text style={{fontSize: FONT_SIZE_20, ...FONT_BOLD, color: BLACK }}>{label}</Text>
            <Text>{value}</Text>
            {subDetail}
        </View>
    )
}

const ProfileName = ({ username }) => {
    const firstLetterOfDisplayName = username.charAt(0).toUpperCase();
    return (
        <View style={{flexDirection: 'row', ...styles.row}}>
            <ProfileLetter letter={firstLetterOfDisplayName} size={100} />
            <View style={{justifyContent: 'center', paddingLeft: 10 }}>
                <Text>Hi there</Text>
                <Text style={{color: BLACK, fontSize: FONT_SIZE_20, ...FONT_BOLD }}>{username}</Text>
            </View>
        </View>
    );
}

const ProgressDetail = ({ label, value }) => {
    return (
        <View style={styles.row}>
            <Text style={{fontSize: FONT_SIZE_20, ...FONT_BOLD, color: ORANGE }}>{label}</Text>
            <Text>{value}</Text>
        </View>
    );
}

const ProgressDetails = ({ xp, ratings }) => {
    return (
        <View style={{flexDirection: 'row', ...styles.row }}>
            <ProgressDetail label="XP" value={xp} />
            <ProgressDetail label="Rating" value={ratings} />
        </View>
    );
}

const MyAccountScreen = ({ navigation }: MyAccountScreenProps) => {
    const [getUserData, { error, data, loading }] = useLazyQuery(USER_QUERY, { pollInterval: POLL_INTERVAL });
    const [otp, setOtp] = useState('')
    const [emailVerified, setEmailVerified] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false)
    const { user } = useAuth();
    const [toast, setToast] = useState({ type: "", message: "" })
    useEffect(() => {
        if(user) {
            getUserData({ variables: { uid : user.uid } })
            const { attributes } = user;
            const { email_verified } = attributes;
            setEmailVerified(email_verified)
        }
    }, [user])

    if (!user || loading) {
        return <CustomModal variant="loading" />
    }
    if (error) {
        return <CustomModal variant="error" />
    }

    const { attributes, username } = user;
    const { email, phone_number: phoneNumber, gender, birthdate } = attributes;
    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");
    const { xp = 0, stars = 0, totalRaters = 0 } = data ? data.user : {};
    const { details, container } = styles;

    const verify = async () => {
        try {
            setToast({ type: toastTypes.LOADING, message: "Verifying OTP" })
            await Auth.verifyCurrentUserAttributeSubmit('email', otp)
            setToast({ type: toastTypes.SUCCESS, message: "Email has been verified" })
            setEmailVerified(true)
            setShowOtpInput(false)   
        } catch (error) {
            setToast({ type: toastTypes.ERROR, message: "Incorrect OTP" })
            setEmailVerified(false)
        }
    }

    const resend = async () => {
        try {
            setToast({ type: toastTypes.LOADING, message: "Please wait" })
            await Auth.verifyCurrentUserAttribute('email')
            setToast({ type: toastTypes.SUCCESS, message: "OTP has been sent" })
        } catch (error) {
            setToast({ type: toastTypes.ERROR, message: "Couldn't send OTP, sorry" })
        }
    }

    const handleVerify = async () => {
        try {
            setToast({ type: toastTypes.LOADING, message: "Sending OTP" })
            await Auth.verifyCurrentUserAttribute('email');
            setToast({ type: toastTypes.SUCCESS, message: "OTP has been sent" })    
            setShowOtpInput(true);
        } catch (error) {          
            setToast({ type: toastTypes.ERROR, message: "Couldn't send OTP" })  
        }
    }

    const handleEdit = () => {
        navigation.navigate(UPDATE_ACCOUNT.screenName, { user })
    }

    const _onClose = () => {
        setShowOtpInput(!showOtpInput)
    }

    return (
        <ScrollView style={{ backgroundColor: LIGHTEST_GRAY }} contentContainerStyle={{flexGrow: 1}}>
            {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
            <OTPVerificationToast 
                show={showOtpInput}
                onClose={_onClose}
                verify={verify}
                resend={resend}
                setOtp={setOtp}
                recepient={email}
            />
            <View style={container}>
                <ProfileName username={username} />
                <ProgressDetails xp={xp} ratings={getRatings(stars, totalRaters)} />
                <View style={details}>
                    <Detail label="Email" value={email} subDetail={!emailVerified && <EmailVerifyMessage handleVerify={handleVerify} />} />
                    <Detail label="Phone" value={phoneNumberWithoutCountryCode} />
                    <Detail label="Gender" value={gender} />
                    <Detail label="Date of birth" value={birthdate} showSeparator={false} />
                    <Button bgColor={ORANGE} textColor={WHITE} onPress={handleEdit}>Edit</Button>
                </View>
            </View>
        </ScrollView>
    );
}

export default MyAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    details: {
        flex: 6, 
        backgroundColor: LIGHTEST_GRAY,
        padding: 20
    }
});
