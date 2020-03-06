
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import { FONT_FAMILY_REGULAR, FONT_SIZE_16,FONT_SIZE_20 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Curve, HeaderTitle } from "../atoms/";

const Header = (props) => {
    const { layout, scene, navigation } = props;
    const { width , height} = layout;
    const { descriptor } = scene;
    const { options } = descriptor;
    const { title, headerLeft=null } = options;

    return (
      <View style={{ 
          alignSelf: 'center',
          width: width,
          overflow: 'hidden',
          backgroundColor: WHITE,
          height: 55
        }}
      >
        <Curve zIndex={2} width={width} bottom={3}>
          <HeaderTitle title={title} width={width} height={height} navigation={navigation} headerLeft={headerLeft} />
        </Curve>
        <Curve bottom={0} zIndex={0} backgroundColor="#f7ca9e" width={width} />
      </View>
    );
  }

  export default Header;