
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { FONT_FAMILY_REGULAR, FONT_SIZE_16,FONT_SIZE_20 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome5'

const Curve = ({bottom = 0, width, children = <Text/>, zIndex=0, backgroundColor=ORANGE }) => {
  return (
    <View style={{  
        borderRadius: width*2,
        backgroundColor: backgroundColor,
        width: width * 4,
        height: width * 4,
        marginLeft: -(width*1.5),
        position:'absolute' ,
        bottom:bottom,
        overflow: 'hidden',
        zIndex: zIndex
      }}
    >
    {children}
    </View>
  );
}

export default Curve;