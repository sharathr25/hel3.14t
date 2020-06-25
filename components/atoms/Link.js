
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { LIGHT_BLUE } from "../../styles/colors";

type LinkProps = {
  onPress : Function, children: any, style: Object 
}

const Link = (props: LinkProps) => {
  const { onPress , children , style = {}} = props;
  return (
    <TouchableOpacity onPress={onPress} style={{...style}}>
        <Text style={{ color: LIGHT_BLUE }}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Link;
