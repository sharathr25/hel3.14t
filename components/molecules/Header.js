import React from 'react'
import { View } from 'react-native';
import { WHITE } from '../../styles/colors';
import { Curve, HeaderTitle } from "../atoms/";

const Header = (props) => {
    const { layout, scene, navigation } = props;
    const { width, height } = layout;
    const { descriptor } = scene;
    const { options } = descriptor;
    const {  headerLeft = null } = options;

    let title = options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

    let screenName = "Home";
    
    if(title === "Main") {
      if(scene.route.state) {
        index = scene.route.state.index;
        screenName = scene.route.state.routeNames[index];
      }
      title = screenName;
    }

    return (
      <View style={{backgroundColor: WHITE, height: 60}}>
        <Curve zIndex={2} width={width} bottom={8} backgroundColor="#FF9933">
          <HeaderTitle title={title} width={width} height={height} navigation={navigation} headerLeft={headerLeft} />
        </Curve>
        <Curve bottom={4} zIndex={1} backgroundColor="#FFA64D" width={width} />
        <Curve bottom={0} zIndex={0} backgroundColor="#FFB366" width={width} />
      </View>
    );
  }

  export default Header;