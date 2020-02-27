
import React from 'react'
import { Text, View } from 'react-native';
import { FONT_FAMILY_REGULAR, FONT_SIZE_16 } from '../../styles/typography';
import { WHITE, ORANGE } from '../../styles/colors';

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

const Title = ({title, width}) => {
  return (
    <View style={{ 
        flex: 1, 
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: ORANGE ,
        width: width,
        position: 'absolute',
        bottom: 20,
        marginLeft: width * 1.5
      }}
    >
      <Text style={{color: WHITE, fontSize: FONT_SIZE_16, fontFamily:FONT_FAMILY_REGULAR }}>{title}</Text>
    </View>
  );
}

const Header = (props) => {
    const { layout, scene } = props;
    const { width } = layout;
    const { descriptor } = scene;
    const { options } = descriptor;
    const { title } = options;
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
          <Title title={title} width={width}/>
        </Curve>
        <Curve bottom={0} zIndex={0} backgroundColor="#f7ca9e" width={width} />
      </View>
    );
  }

  export default Header;