// @flow
import React, { useState , useContext } from "react";
import { Text, Input } from "react-native-elements";
import { View, TouchableOpacity, StyleSheet, Alert, Keyboard, ScrollView, Dimensions } from "react-native";
import { WHITE, ORANGE, BLACK, RED } from "../../styles/colors";
import { FONT_FAMILY_REGULAR, FONT_SIZE_20, FONT_SIZE_12, FONT_WEIGHT_BOLD } from "../../styles/typography";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useLocation } from "../../customHooks/";
import Context from "../../context";
import { CustomModal } from "../../components/molecules";
import { padding } from "../../styles/mixins";

const WORD_LIMIT = 5;
const CORNER_SIZE = 25;
const NO_OF_LINES_FOR_DESC = Math.ceil(Dimensions.get("window").height / 50);
const noOfPeopleSelectBoxOptions = [1, 2, 3, 4, 5, 6];

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

    const handleCheckBox = (val) => {
        setState({ ...state, noPeopleRequired: val, [`checkBox${val}`]: true });
    }

    const getCheckBoxStyle = (val) => [styles.defaultCheckBoxStyle, state.noPeopleRequired === val ? styles.activeCheckBox : styles.inActiveCheckBox];

    const getCheckBoxTextStyle = (val) => state.noPeopleRequired === val ? styles.activeText : styles.inActiveText;

    const requestHelp = () => {
        const { description, noPeopleRequired } = state;
        if (locationProviderAvailable === false && latitude === null && longitude === null) {
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

    const { requestHelpStyle, requestButtonText, container, label, descriptionContainerStyle, noPeopleSelector } = styles;

    const Option = ({ val }) => (
        <TouchableOpacity onPress={() => handleCheckBox(val)} style={getCheckBoxStyle(val)} key={val}>
            <Text style={getCheckBoxTextStyle(val)}>{val}</Text>
        </TouchableOpacity>
    );

    const RequestButton = () => (
        <TouchableOpacity onPress={requestHelp} style={requestHelpStyle}>
            <Text style={requestButtonText}>Request</Text>
        </TouchableOpacity>
    );

    const getWordsLeft = (description) => {
        return WORD_LIMIT - description.split(/\s/).length + 1;
    }

    const WordLimitStatus = () => {
        const { description } = state;
        const wordsThreshold = getWordsLeft(description);
        if(wordsThreshold <= 0) {
            return <Text style={{...label, color: RED, textAlign: 'right', right: 10}}>Limit reached</Text>
        }
        return <Text style={{...label, color: "#979797", textAlign: 'right', right: 10}}>{wordsThreshold} words left</Text>
    }

    if (showModal) {
        if (loading) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="loading" />
        } else if (data) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="success" desc="Goto Activity tab to check your help request" />
        } else if (error) {
            return <CustomModal onClose={() => setShowModal(!showModal)} variant="error" />
        }
    }

    const _onChangeText = (value) => {
        const temp = state.description;
        if(getWordsLeft(value) <= 0 && value[value.length - 1] !== ' ') {
            setState({...state, description: temp});
        } else {
            setState({ ...state, description: value })
        }
    }

    return (
        <ScrollView style={{backgroundColor: WHITE}}>
            <View style={container}>
                <View style={{backgroundColor: WHITE, borderRadius: 10, elevation: 10, borderWidth: 0.1, borderColor: BLACK }}>
                    <Text style={{...label, padding:10}}>Request will be created for current location</Text>
                    {/* <View style={{borderColor: BLACK, borderTopWidth: 2, borderLeftWidth: 2, width: CORNER_SIZE, height: CORNER_SIZE, left: 10, position: 'absolute', top: 36, zIndex: 2}}/> */}
                    {/* <View style={{borderColor: BLACK, borderTopWidth: 2, borderRightWidth: 2,width: CORNER_SIZE, height: CORNER_SIZE, right: 10, position: 'absolute', top: 36, zIndex: 2}}/> */}
                    <Input
                        placeholder="Please describe your help"
                        inputContainerStyle={descriptionContainerStyle}
                        multiline={true}
                        numberOfLines={NO_OF_LINES_FOR_DESC}
                        onChangeText={_onChangeText}
                        inputStyle={{textAlign: 'center'}}
                        value={state.description}
                    />
                    {/* <View style={{borderColor: BLACK, borderBottomWidth: 2,borderLeftWidth: 2, width: CORNER_SIZE, height: CORNER_SIZE, left: 10, position: 'absolute', top: NO_OF_LINES_FOR_DESC* 23.5, zIndex: 2}}/> */}
                    {/* <View style={{borderColor: BLACK, borderBottomWidth: 2,borderRightWidth: 2, width: CORNER_SIZE, height: CORNER_SIZE, right: 10, position: 'absolute', top: NO_OF_LINES_FOR_DESC* 23.5, zIndex: 2}}/> */}
                    <WordLimitStatus />
                    <Text style={label}>Please select number of people required for help</Text>
                    <View style={noPeopleSelector}>
                        {noOfPeopleSelectBoxOptions.map((val) => <Option key={val} val={val} />)}
                    </View>
                    <RequestButton />
                </View>
            </View>
        </ScrollView>  
    );
}

export default HelpRequestForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: WHITE,
        padding: 20,
    },
    requestHelpStyle: {
        margin: 10,
        ...padding(5,15,5,15),
        backgroundColor: ORANGE,
        borderRadius: 10,
        alignSelf: 'center'
    },
    requestButtonText: {
        textAlign: 'center',
        color: WHITE,
        fontSize: FONT_SIZE_20
    },
    descriptionContainerStyle: {
        backgroundColor: WHITE,
        borderWidth: 1, 
        borderColor: BLACK,
    },
    noPeopleSelector: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        fontFamily: FONT_FAMILY_REGULAR
    },
    inActiveText: {
        color: ORANGE,
        fontSize: 20,
        fontFamily: FONT_FAMILY_REGULAR
    },
    label: {
        color: BLACK,
        fontSize: FONT_SIZE_12,
        textAlign: 'center',
    }
});