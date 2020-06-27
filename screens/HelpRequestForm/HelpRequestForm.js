
import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Keyboard, Dimensions } from "react-native";
import { WHITE, RED, LIGHT_GRAY } from "../../styles/colors";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { useLocation, useAuth } from "../../customHooks/";
import { CustomModal } from "../../components/molecules";
import { Toast } from "../../components/atoms";
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { StyleProvider, Container, Content, Textarea, Button, Text, View } from "native-base";

const WORD_LIMIT = 300;
const { height } = Dimensions.get("window");
const NO_OF_LINES_FOR_DESC = height / 42;
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

const HelpRequestForm = ({navigation}) => {
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
        <StyleProvider style={getTheme(material)}>
            <Container>
                {getToast().type !== "" && <Toast  duration={4000} {...getToast()} />}
                <Content style={{ marginHorizontal: 10 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <Textarea 
                        placeholder="Please describe your help"
                        rowSpan={NO_OF_LINES_FOR_DESC}
                        onChangeText={_onChangeText}
                        value={desc}
                        bordered
                    />
                    <WordLimitStatus />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button onPress={_onPress} primary full large bordered>
                            <Text>Cancel </Text>
                        </Button>
                        <Button primary full large onPress={requestHelp}>
                            <Text>Request</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        </StyleProvider>
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