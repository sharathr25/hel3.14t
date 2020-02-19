// @flow
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GREEN, BLACK } from "../../styles/colors";

const Success = ({ desc = "" } : { desc: string }) => {
    const { content, textStyle, descStyle } = styles;
    return (
        <View style={content}>
            <Icon name="check-circle" color={GREEN} size={50}></Icon>
            <Text style={textStyle}>Success</Text>
            {desc && <Text style={descStyle}>{desc}</Text>}
        </View>
    )
}

export default Success;

const styles = StyleSheet.create({
    content: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: BLACK,
        fontSize: 20
    },
    descStyle: {
        textAlign: 'center',
    }
});
