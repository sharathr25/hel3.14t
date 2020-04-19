// @flow
import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { FONT_SIZE_14, FONT_SIZE_18 } from "../../styles/typography";
import { BLACK } from "../../styles/colors";
import { margin } from "../../styles/mixins";

const Description = ({children, height} : { children: any, height: Number }) => {
  const { descriptionContainer, descriptionStyle } = styles;
  return (
    <ScrollView style={{...descriptionContainer, height }}>
      <Text style={descriptionStyle}>{children}</Text>
    </ScrollView>
  );
};

export default Description;

const styles = StyleSheet.create({
    descriptionStyle: {
        color: BLACK,
        fontSize: FONT_SIZE_14,
        lineHeight: FONT_SIZE_18,
        padding: 10,
      },
      descriptionContainer: {
        borderColor: BLACK, 
        ...margin(10,0,20,0),
        elevation: 2
      }
});
