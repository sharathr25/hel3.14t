
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { FONT_FAMILY_REGULAR, FONT_SIZE_16,FONT_SIZE_20 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Curve, HeaderTitle } from "../atoms/";

const getMainScreenTitle = (screenName: String) => {
  if(screenName === "Request") return "New help request";
  return "some name";
}

const Header = (props) => {
    const { layout, scene, navigation } = props;
    const { width, height } = layout;
    const { descriptor } = scene;
    const { options } = descriptor;
    const {  headerLeft=null, headerRight=null } = options;

    let title = options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

    let screenName;
    
    if(title === "Main") {
      screenName = "Top Ranks";
      if(scene.route.state) {
        index = scene.route.state.index;
        screenName = getMainScreenTitle(scene.route.state.routeNames[index]);
      }
      title = screenName;
    }

    return (
      <View>
        <View style={{backgroundColor: "#FFB366", height: 60}}>
          <Curve zIndex={2} width={width} bottom={8} backgroundColor="#FF9933">
            {/* <HeaderTitle title={title} width={width} height={height} navigation={navigation} headerLeft={headerLeft} headerRight={headerRight}/> */}
          </Curve>
          <Curve bottom={4} zIndex={1} backgroundColor="#FFA64D" width={width} />
          <Curve bottom={0} zIndex={0} backgroundColor="#FFB366" width={width} />
        </View>
        <View style={{backgroundColor: "#FFB366", height: 40}}>
          <Text style={{textAlign: 'center', color: WHITE, fontSize: FONT_SIZE_20}}>{title}</Text>
        </View>
      </View>
    );
  }

  export default Header;