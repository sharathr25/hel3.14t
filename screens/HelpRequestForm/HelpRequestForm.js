
import React, { useState, useEffect } from "react";
import { Text, Input } from "react-native-elements";
import { View, TouchableOpacity, StyleSheet, Alert, Keyboard, Dimensions } from "react-native";
import { WHITE, ORANGE, RED, LIGHT_GRAY } from "../../styles/colors";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useLocation, useAuth } from "../../customHooks/";
import { CustomModal } from "../../components/molecules";
import { Toast, Button } from "../../components/atoms";
import Icon from "react-native-vector-icons/FontAwesome";

const WORD_LIMIT = 300;
const { height } = Dimensions.get("window");
const NO_OF_LINES_FOR_DESC = height / 30;
const NO_OF_PEOPLE_REQUIRED_BY_DEFAULT = 1;

const HELP_REQUEST = gql`
  mutation CreateHelpRequest($uid:String!,$username: String!, $mobileNo:String!,$lat:Float!,$long:Float!,$desc:String!, $time:Date!, $name:String!, $noPeopleRequired:Int!){
    createHelp(data:{
      creator:$uid,
      creatorName: $username,
      mobileNo:$mobileNo,
      name:$name,
      latitude:$lat,
      longitude:$long,
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

const HelpRequestForm = ({navigation}: {navigation: Object}) => {
    const [desc, setDesc] = useState("")
    const [noPeopleRequired, setNoPeopleRequired] = useState(NO_OF_PEOPLE_REQUIRED_BY_DEFAULT);
    const [createHelp, { loading, data, error }] = useMutation(HELP_REQUEST);
    const { longitude, latitude, locationProviderAvailable, locationErrorMessage } = useLocation();
    const { user: currentUser } = useAuth();
    useEffect(() => {
        if(data) setDesc("");
    }, [data])

    if(!currentUser) return <CustomModal variant="loading" />
    const { uid, attributes, username } = currentUser;
    const { name, phone_number: phoneNumber } = attributes;
    const { container, formInput, closeButtonContainer, closeButton } = styles;

    const requestHelp = () => {
        if (locationProviderAvailable === false && latitude === null && longitude === null) {
            Alert.alert(locationErrorMessage ? locationErrorMessage : "location error");
        } else {
            Keyboard.dismiss();
            createHelp({
                variables: {
                    uid,
                    noPeopleRequired,
                    mobileNo: phoneNumber,
                    lat: latitude,
                    long: longitude,
                    desc,
                    time: new Date().getTime(),
                    name,
                    username
                }
            });
        }
    }

    const getWordsLeft = (desc) => WORD_LIMIT - desc.split(/\s/).length + 1;

    const WordLimitStatus = () => {
        const wordsThreshold = getWordsLeft(desc);
        const textColor = wordsThreshold <= 0 ? RED : LIGHT_GRAY;
        const text = wordsThreshold <= 0 ? "Limit Reached" : `${wordsThreshold} words left`;
        return <Text style={{color: textColor, alignSelf: 'flex-end' }}>{text}</Text>
    }

    const _onChangeText = (value) => {
        const temp = desc;
        const lastCharacter = value[value.length - 1];
        const descForUpdate = getWordsLeft(value) <= 0 && lastCharacter !== ' ' ? temp : value;
        setDesc(descForUpdate);
    }

    const getToast = () => {
        let type = "", message = "", cbForToastEnd = () => {};
        if(loading) { 
            type = "loading"
            message = "Please wait..." 
        } else if(data) { 
            type = "success" 
            message = "Your request has been created, taking you to activity" 
            cbForToastEnd = () => navigation.jumpTo('Activity')
        } else if(error) { 
            type = "danger"; 
            message = "Something went wrong! try again"
        }
        return  { type, message, cbForToastEnd }
    }

    const _onPress = () => {
        navigation.jumpTo('Home')
    }

    return (
        <View style={container}>
            {getToast().type !== "" && <Toast  duration={4000} {...getToast()} />}
            <TouchableOpacity onPress={_onPress} style={closeButtonContainer}>
                <Icon name="remove" size={25} color={WHITE} style={closeButton} />
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center' }}>Request will be created for current location</Text>
            <Input
                placeholder="Please describe your help"
                inputContainerStyle={formInput}
                containerStyle={{ paddingHorizontal: 0, flex: 1 }}
                multiline={true}
                numberOfLines={NO_OF_LINES_FOR_DESC}
                onChangeText={_onChangeText}
                inputStyle={{ textAlignVertical: 'top', textAlign: 'center' }}
                value={desc}
            />
            <WordLimitStatus />
            <Button bgColor={ORANGE} textColor={WHITE} onPress={requestHelp}>Request</Button>
        </View> 
    );
}

export default HelpRequestForm;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: WHITE,
    },
    formInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
    },
    closeButtonContainer: {
        position: 'absolute', 
        top:-55, 
        right: -55, 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: RED
    },
    closeButton: {
        position: 'absolute', 
        top: 60, 
        right: 65
    }
})