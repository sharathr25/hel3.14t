import React from 'react';
import { Text, View } from 'react-native';
import { ORANGE } from '../../constants/styleConstants';

const BoxText = (props) => {
    return (
      <View style={{borderColor: ORANGE, borderWidth: 1, borderRadius:5, flexDirection:'row', marginRight:5}}>
        <View style={{backgroundColor: ORANGE, padding:3}}>
          <Text style={{color: 'white'}}>{props.leftText}</Text>
        </View>
        <View style={{padding:3}}>
          <Text style={{color:ORANGE}}>{props.rightText}</Text>
        </View>
      </View>
    );
  }

  export default BoxText;