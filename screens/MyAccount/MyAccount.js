// @flow
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ToastAndroid } from 'react-native';
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { ORANGE, WHITE, BLACK, LIGHTEST_GRAY } from '../../styles/colors';
import { ProfileLetter, Button, Link} from '../../components/atoms';
import { Auth } from "aws-amplify";
import { SCREEN_DETAILS } from "../../constants/appConstants";
import { useAuth } from "../../customHooks";
import { FONT_BOLD, FONT_SIZE_20 } from '../../styles/typography';
import { CustomModal, OTPVerificationModal } from '../../components/molecules';

const { UPDATE_ACCOUNT } = SCREEN_DETAILS; 

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
    const width = Dimensions.get('screen').width - 100;
    return (
        <View style={{ flex: 1, padding: 20, borderBottomWidth: showSeparator ? 0.5 : 0, width }}>
            <Text style={{fontSize: FONT_SIZE_20, ...FONT_BOLD, color: BLACK }}>{label}</Text>
            <Text>{value}</Text>
            {subDetail}
        </View>
    )
}

const ProfileName = ({ username }) => {
    const firstLetterOfDisplayName = username.charAt(0).toUpperCase();
    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
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
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{fontSize: FONT_SIZE_20, ...FONT_BOLD, color: ORANGE }}>{label}</Text>
            <Text>{value}</Text>
        </View>
    );
}

const ProgressDetails = ({ xp, stars }) => {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
            <ProgressDetail label="XP" value={xp} />
            <ProgressDetail label="Rating" value={stars} />
        </View>
    );
}

const MyAccountScreen = ({ navigation }: MyAccountScreenProps) => {
    const [getUserData, { error, data, loading }] = useLazyQuery(USER_QUERY, { pollInterval: 100 });
    const [otp, setOtp] = useState('')
    const [emailVerified, setEmailVerified] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false)
    const { user } = useAuth();
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
    const { xp = 0, stars = 0 } = data ? data.user : {};
    const { column, container } = styles;

    const verify = async () => {
        try {
            await Auth.verifyCurrentUserAttributeSubmit('email', otp)
            // TODO : Need to show toast sucess
            setEmailVerified(true)
            setShowOtpInput(false)   
        } catch (error) {
            // TODO : Need to show toast error
            setEmailVerified(false)
        }
    }

    const resend = async () => {
        return await Auth.verifyCurrentUserAttribute('email')
    }

    const handleVerify = async () => {
        await Auth.verifyCurrentUserAttribute('email');
        setShowOtpInput(true);
    }

    const handleEdit = () => {
        navigation.navigate(UPDATE_ACCOUNT.screenName, { user })
    }

    return (
        <ScrollView style={{ backgroundColor: LIGHTEST_GRAY }}>
        <View style={container}>
            <View style={{ ...column, backgroundColor: WHITE }}>
                <ProfileName username={username} />
                <ProgressDetails xp={xp} stars={stars} />
            </View>
            <View style={{...column, padding: 0 }}>
                <Detail label="Email" value={email} subDetail={!emailVerified && <EmailVerifyMessage handleVerify={handleVerify} />} />
                <Detail label="Phone" value={phoneNumberWithoutCountryCode} />
                <Detail label="Gender" value={gender} />
                <Detail label="Date of birth" value={birthdate} showSeparator={false} />
                <Button bgColor={ORANGE} textColor={WHITE} onPress={handleEdit} >Edit</Button>
            </View>
            <OTPVerificationModal 
                show={showOtpInput}
                onClose={() => {setShowOtpInput(!showOtpInput)}}
                verify={verify}
                resend={resend}
                setOtp={setOtp}
                recepient={email}
            />
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
    column: {
        backgroundColor: LIGHTEST_GRAY,
        alignItems: 'center',
        padding: 20
    },
});
