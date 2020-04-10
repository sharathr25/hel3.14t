
import React from 'react'
import { Text, View } from 'react-native';
import { ORANGE } from '../../styles/colors';

const Curve = ({bottom = 0, width, children = <Text/>, zIndex=0, backgroundColor=ORANGE }) => {
  const curveRadius = 5
  return (
    <View style={{  
        borderRadius: width*curveRadius,
        backgroundColor: backgroundColor,
        width: width * curveRadius*2,
        height: width * curveRadius*2,
        marginLeft: -(width*(curveRadius - 0.5)),
        position:'absolute' ,
        bottom:bottom,
        overflow: 'hidden',
        zIndex: zIndex,
        alignItems: 'center',
      }}
    >
    {children}
    </View>
  );
}

export default Curve;