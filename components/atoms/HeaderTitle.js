
import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_FAMILY_REGULAR,FONT_SIZE_20 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const HeaderTitle = (props) => {
  const {title, width, height , showBackButton, navigation, headerLeft} = props;
  const { container, titleStyle, BackButtonStyle } = styles;
  const BackButton = () => {
      return (
        <TouchableOpacity style={{left: height > width ? 10 : 150, ...BackButtonStyle }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={WHITE}/>
        </TouchableOpacity>
      );
  }

  return (
    <View style={{ width, marginLeft: width * 1.5, ...container }}>
      {headerLeft ? headerLeft : navigation.canGoBack() && showBackButton && <BackButton />}
      <Text style={titleStyle}>{title}</Text>
    </View>
  );
}

HeaderTitle.defaultProps = {
  showBackButton: true
}

export default HeaderTitle;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems:'center', 
    justifyContent: 'center',
    backgroundColor: ORANGE ,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row'
  },
  titleStyle: {
    color: WHITE, 
    fontSize: FONT_SIZE_20, 
    fontFamily:FONT_FAMILY_REGULAR
  },
  BackButtonStyle: {
    position:'absolute', 
    bottom: 5
  }
});