import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useAuth from '../customHooks/auth';
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import Loader from '../components/common/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../constants/styleConstants';
import Error from '../components/common/Error';

const USER_QUERY = gql`
    query User($uid:String!) {
        user(uid:$uid){
            xp,
            stars
        }
    }
`;

const MyAccountScreen = (props) => {
    const { navigation } = props;
    const { user } = useAuth();
    const [getUserData, { error, data, loading }] = useLazyQuery(USER_QUERY);

    useEffect(() => {
        getUserData({ variables: { uid } })
    }, [uid])

    handleLogOut = () => {
        console.log(navigation);
        // firebase.auth().signOut();
    }

    if (loading) {
        return <Loader />
    }
    if (error) {
        return <Error />
    }

    const { displayName, email, phoneNumber, uid } = user;
    const phoneNumberWithoutCountryCode = phoneNumber.replace("+91", "");
    const firstLetterOfDisplayName = displayName.charAt(0).toUpperCase();

    const { xp = 0, stars = 0 } = data ? data.user : {};

    const { details, displayNameStyle, profileLetterContainer, profileLetter, text, xpContainerStyle, xpTextStyle, detailRow, icon, container } = styles;

    return (
        <View style={container}>
            <View style={profileLetterContainer}>
                <Text style={profileLetter}>{firstLetterOfDisplayName}</Text>
            </View>
            <Text style={displayNameStyle}>{displayName}</Text>
            <View style={details}>
                <View style={detailRow}>
                    <View style={icon}>
                        <Icon size={30} name="envelope-o" color={FLAG_COLOR_ORANGE} />
                    </View>
                    <Text style={text}>{email}</Text>
                </View>
                <View style={detailRow}>
                    <View style={icon}>
                        <Icon size={30} name="phone" color={FLAG_COLOR_ORANGE} />
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
                        <Icon size={30} name="star-o" color={FLAG_COLOR_ORANGE} />
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
        backgroundColor: FLAG_COLOR_ORANGE,
        width: 200,
        height: 200,
        borderRadius: 100,
        position: 'relative',
        margin: 5
    },
    profileLetter: {
        color: FLAG_COLOR_WHITE,
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
        borderColor: FLAG_COLOR_ORANGE,
        padding: 4,
        borderRadius: 5
    },
    xpTextStyle: {
        color: FLAG_COLOR_ORANGE,
        fontWeight: 'bold',
    },
    icon: {
        width: 30,
        height: 30
    }
});
