import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ProfileLetter from '../../common/profileLetter';
import BoxText from '../../common/boxText';

const AccetedUser = (props) => {
    return (
      <View style={{ flex:1, flexDirection:'row', alignItems:'center'}}>
          <View style={{margin: 5}}>
            <ProfileLetter letter={`${props.name.substring(0,1)}`}/>
          </View>
          <View style={{ marginLeft: 5, flex:1}}>
            <Text>{props.name}</Text>
            <View style={{ flex:1, flexDirection:'row', justifyContent:'flex-start'}}>
              <BoxText leftText="XP" rightText={props.xp} />
              {props.mobileNumber ? <BoxText leftText="Ph No" rightText={props.mobileNumber} />:null}
            </View>
          </View>
        </View>
    );
  }

  export default AccetedUser;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent:'space-evenly',
      alignItems: 'center',
      marginTop: 5
    },
    item:{
      textAlign: 'center'
    }
  });
