
import React from "react";
import { Text, StyleSheet } from "react-native";
import { FONT_SIZE_14 } from "../../styles/typography";
import { BLACK, LIGHT_GRAY } from "../../styles/colors";

type DescriptionFixedProps = {
  children: any
}
const DescriptionFixed = ({children} : DescriptionFixedProps) => {
  const { descriptionStyle } = styles;
  return (
    <Text style={descriptionStyle} numberOfLines={5}>
        {children}
    </Text>    
  );
};

export default DescriptionFixed;

const styles = StyleSheet.create({
    descriptionStyle : {
        color: BLACK, 
        fontSize: FONT_SIZE_14,  
        height: 100 
    }
});
