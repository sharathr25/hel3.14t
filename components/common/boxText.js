import React from 'react';
import { Text, View } from 'react-native';
import { FLAG_COLOR_ORANGE } from '../../constants/styleConstants';

const BoxText = (props) => {
    return (
      <View style={{borderColor: FLAG_COLOR_ORANGE, borderWidth: 1, borderRadius:5, flexDirection:'row', marginRight:5}}>
        <View style={{backgroundColor: FLAG_COLOR_ORANGE, padding:3}}>
          <Text style={{color: 'white'}}>{props.leftText}</Text>
        </View>
        <View style={{padding:3}}>
          <Text style={{color:FLAG_COLOR_ORANGE}}>{props.rightText}</Text>
        </View>
      </View>
    );
  }

  export default BoxText;