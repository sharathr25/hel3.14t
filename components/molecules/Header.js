import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { WHITE, ORANGE, LIGHTER_ORANGE, LIGHTEST_ORANGE } from '../../styles/colors';
import { FONT_SIZE_20, FONT_FAMILY_BOLD } from '../../styles/typography';
import { BackButton } from '../atoms';

const Header = (props) => {
  const { scene, navigation } = props;
  const { descriptor } = scene;
  const { options } = descriptor;
  const {  headerLeft = null } = options;

  let title = options.headerTitle !== undefined
    ? options.headerTitle
    : options.title !== undefined
      ? options.title
      : scene.route.name;
  
  if(title === "Main") {
    let screenName = "Home";
    if(scene.route.state) {
      index = scene.route.state.index;
      screenName = scene.route.state.routeNames[index];
    }
    title = screenName;
  }

  const { container, titleStyle, column } = styles;

  return (
    <View style={{backgroundColor: WHITE, height: 60}}>
      <View style={container}>
        <View style={column}>
          {headerLeft ? headerLeft : <BackButton navigation={navigation} />}
        </View>
        <View style={{...column, flex: 5}}>
          <Text style={titleStyle}>{title}</Text>
        </View>
        <View style={column}>
          {/* {headerRight ? headerRight : null} */}
        </View>
      </View>
      <View style={{backgroundColor: LIGHTER_ORANGE, height: 4}} />
      <View style={{backgroundColor: LIGHTEST_ORANGE, height: 4}} />
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: ORANGE ,
    flexDirection: 'row',
    height: 60
  },
  titleStyle: {
    color: WHITE, 
    fontSize: FONT_SIZE_20, 
    fontFamily:FONT_FAMILY_BOLD
  },
  column: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent:'center'
  }
});