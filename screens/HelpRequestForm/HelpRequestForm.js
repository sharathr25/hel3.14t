import React, { useState , useContext } from "react";
import { Text, Input } from "react-native-elements";
import { View, TouchableOpacity, StyleSheet, Alert, Keyboard } from "react-native";
import { WHITE, ORANGE, FONT_FAMILY } from "../../styles/colors";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useLocation } from "../../customHooks/";
import Context from "../../context";
import { CustomModal } from "../../components/molecules";

const LIMIT = 3;

const HELP_REQUEST = gql`
  mutation CreateHelpRequest($uid:String!,$mobileNo:String!,$lat:Float!,$long:Float!,$desc:String!, $time:Date!, $name:String!, $noPeopleRequired:Int!){
    createHelp(data:{
      creator:$uid,
      mobileNo:$mobileNo,
      name:$name,
      latitude:$long,
      longitude:$lat,
      timeStamp: $time,
      noPeopleAccepted:0,
      noPeopleRequested:0,
      status:"REQUESTED",
      description:$desc,
      noPeopleRequired:$noPeopleRequired
    }){
      _id
    }
  }
`;

const noOfPeopleSelectBoxOptions = [1, 2, 3, 4, 5, 6];

const Option = ({ val }) => {
    return (
        <TouchableOpacity onPress={() => handleCheckBox(val)} style={getCheckBoxStyle(val)} key={val}>
            <Text style={getCheckBoxTextStyle(val)}>{val}</Text>
        </TouchableOpacity>
    );
}

const HelpRequestForm = () => {
    const [state, setState] = useState({
        noPeopleRequired: 1,
        description: "",
        latitude: null,
        longitude: null,
        locationProviderAvailable: false,
        locationErrorMessage: "",
    });

    const [showModal, setShowModal] = useState(false);

    const { user: currentUser } = useContext(Context);
    const { uid, attributes } = currentUser;
    const { name, phone_number: phoneNumber } = attributes;

    const { longitude, latitude, locationProviderAvailable, locationErrorMessage } = useLocation();

    const [createHelp, { loading, data, error }] = useMutation(HELP_REQUEST);

    handleCheckBox = (val) => {
        setState({ ...state, noPeopleRequired: val, [`checkBox${val}`]: true });
    }

    getCheckBoxStyle = (val) => [styles.defaultCheckBoxStyle, state.noPeopleRequired === val ? styles.activeCheckBox : styles.inActiveCheckBox];

    getCheckBoxTextStyle = (val) => state.noPeopleRequired === val ? styles.activeText : styles.inActiveText;

    requestHelp = () => {
        const { description, noPeopleRequired } = state;
        if (description.length < LIMIT) {
            Alert.alert(`description should contain minimum ${LIMIT} characters`);
        } else if (locationProviderAvailable === false && latitude === null && longitude === null) {
            Alert.alert(locationErrorMessage ? locationErrorMessage : "location error");
        } else {
            Keyboard.dismiss();
            setShowModal(true);
            createHelp({
                variables: {
                    uid,
                    noPeopleRequired,
                    mobileNo: phoneNumber,
                    lat: latitude,
                    long: longitude,
                    desc: description,
                    time: new Date().getTime(),
                    name,
                }
            });
        }
    }

    const { signInContainerStyle, signInText, container, selectBoxLabel, selectBoxContainer, descriptionContainerStyle, inputLabelStyle } = styles;

    if (showModal) {
        if (loading) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="loading" />
        } else if (data) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="success" desc="Goto Activity tab to check your help request" />
        } else if (error) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="error" />
        }
    }

    return (
        <View style={container}>
            <Input
                label="Can you type some description?"
                labelStyle={inputLabelStyle}
                inputContainerStyle={descriptionContainerStyle}
                multiline={true}
                numberOfLines={4}
                onChangeText={value => setState({ ...state, description: value })}
            />
            <View style={selectBoxContainer}>
                <Text style={selectBoxLabel}>How many people do you require?</Text>
                <View style={styles.noPeopleSelector}>
                    {noOfPeopleSelectBoxOptions.map((val) => <Option key={val} val={val} />)}
                </View>
            </View>
            <TouchableOpacity onPress={requestHelp} style={signInContainerStyle}>
                <Text style={signInText}>Request help</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HelpRequestForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        padding: 10
    },
    inputLabelStyle: {
        top: 10, zIndex: 2, left: 10, backgroundColor: WHITE, alignSelf: 'flex-start', paddingLeft: 10, paddingRight: 10
    },
    signInContainerStyle: {
        margin: 10,
        marginTop: 25,
        padding: 10,
        backgroundColor: ORANGE,
        borderRadius: 25
    },
    signInText: {
        textAlign: 'center',
        color: WHITE,
        fontSize: 18
    },
    modalInnerContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: WHITE,
        justifyContent: 'center',
        alignItems: "center",
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        backgroundColor: ORANGE,
        borderRadius: 15
    },
    descriptionContainerStyle: {
        borderWidth: 1,
        borderColor: ORANGE,
        borderRadius: 5
    },
    noPeopleSelector: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    activeCheckBox: {
        backgroundColor: ORANGE,
        borderColor: ORANGE,
    },
    defaultCheckBoxStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 14,
        paddingRight: 14,
        margin: 5,
        borderRadius: 5
    },
    inActiveCheckBox: {
        backgroundColor: WHITE,
        borderColor: ORANGE,
    },
    activeText: {
        color: WHITE,
        fontSize: 20,
        fontFamily: FONT_FAMILY
    },
    inActiveText: {
        color: ORANGE,
        fontSize: 20,
        fontFamily: FONT_FAMILY
    },
    buttons: {
        height: 60,
        display: 'flex',
        flexDirection: 'row'
    },
    selectBoxLabel: {
        top: -15,
        zIndex: 2,
        left: 10,
        backgroundColor: WHITE,
        alignSelf: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 5,
    },
    selectBoxContainer: {
        borderWidth: 1,
        borderColor: ORANGE,
        borderRadius: 5,
        margin: 10,
        marginTop: 15
    }
});