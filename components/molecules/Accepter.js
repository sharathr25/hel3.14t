// @flow
import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Heading, BoxButton, InlineLoader } from '../atoms';
import { ORANGE, LIGHTEST_GRAY, GREEN, LIGHT_GREEN } from "../../styles/colors";
import { margin } from "../../styles/mixins";
import gql from 'graphql-tag';
import { callPhone } from '../../utils';
import { useMutation } from 'react-apollo';
import { Slider } from 'react-native-elements';

const UPDATE_HELP = gql`
    mutation UpdateHelp($id:String!, $key:String!,$value:Any, $type:String!, $operation:String!){
        updateHelp(id:$id, key:$key, value:$value, type:$type, operation:$operation){
            _id
        }
    }
`;

type AccepterProps = {
  userDetails: {
    name: string, 
    mobileNo: string,
    stars: number, 
    uidOfAccepter: string
  },
  helpRequestDetails: {
    keyOfHelpRequest: string,
    status: string, 
  }
};

const Accepter = (props: AccepterProps) => {
  const { userDetails, helpRequestDetails } = props;
  const { mobileNo, stars, uidOfAccepter, username } = userDetails;
  const { status, keyOfHelpRequest } = helpRequestDetails;
  const [starsGivenByUser, setStarsGivenByUser] = useState(0);
  const [updateHelp, { loading }] = useMutation(UPDATE_HELP);
  const { container, details } = styles;
  const mobileNoWithoutCountryCode = mobileNo.replace(/^(\+91\d{6})(\d{4})/, "xxxxxx$2");

  const call = () => {
    callPhone(mobileNo)
  }

  const handleSubmit = () => {
    if(starsGivenByUser !== 0) {
      updateHelp({
        variables: {
            id: keyOfHelpRequest,
            key: "usersAccepted",
            value: { [uidOfAccepter]: { stars: starsGivenByUser } },
            type: "array",
            operation: "update"
        }
      })
    } else {
        Alert.alert("You need give some rating");
        return;
    }
  }

  const StarsSlider = () => {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <Slider 
          value={starsGivenByUser} 
          onSlidingComplete={setStarsGivenByUser} 
          maximumValue={100} step={1} 
          minimumTrackTintColor={ORANGE}
          thumbTintColor={ORANGE}
        />
      </View>
    );
  }

  const StarsAndCTA = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <BoxButton title={stars ? stars : starsGivenByUser} onPress={() => {}} iconName="star" />
        {!stars ? <BoxButton title="Submit" onPress={handleSubmit} bgColor={LIGHT_GREEN} titleColor={GREEN} iconName="check-circle-o" /> : null}
      </View>
    );
  }

  if (!status) return null;

  const statusToDetailsMapping = {
    "ON_GOING" : mobileNo && <Text>{mobileNoWithoutCountryCode}</Text>,
    "COMPLETED" : stars ? null : <StarsSlider />
  }

  const statusToCTAMapping = {
    "ON_GOING" : <BoxButton title="Call" onPress={call} iconName="phone" /> ,
    "COMPLETED" : <StarsAndCTA />
  }

  if(loading) {
    return (
      <View style={{...container, padding: 25 }}>
        <InlineLoader />
      </View>
    )
  }

  return (
    <View style={container}>
      <View style={details}>
        <Heading color={ORANGE}>{username}</Heading>
        {statusToDetailsMapping[status]}
      </View>
      {statusToCTAMapping[status]}
    </View>
  );
}

export default Accepter;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHTEST_GRAY,
    ...margin(5,0,5,0),
    justifyContent: 'space-between'
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 5
  },
});
