
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { FONT_FAMILY_REGULAR,FONT_SIZE_20 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const HeaderTitle = ({title, width, height , showBackButton = true, navigation, headerLeft, headerRight}) => {
  const BackButton = () => {
      return (
        <TouchableOpacity style={{position:'absolute', left: height > width ? 10 : 150, bottom: 5 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={WHITE}/>
        </TouchableOpacity>
      );
  }

  return (
    <View style={{ 
        flex: 1, 
        alignItems:'center', 
        justifyContent: 'center',
        backgroundColor: ORANGE ,
        width: width,
        position: 'absolute',
        bottom: 10,
        marginLeft: width * 1.5,
        flexDirection: 'row'
      }}
    >
      {navigation.canGoBack() && showBackButton && (headerLeft ? headerLeft : <BackButton />)}
      <Text style={{color: WHITE, fontSize: FONT_SIZE_20, fontFamily:FONT_FAMILY_REGULAR }}>{title}</Text>
    </View>
  );
}

  export default HeaderTitle;