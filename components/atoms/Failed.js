// @flow
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RED, BLACK } from "../../styles/colors";

const Failed = (props: { desc: string }) => {
    const { desc = "Failed" } = props;
    const { content, textStyle } = styles;
    <View style={content}>
        <Icon name="times-circle" color={RED} size={50}></Icon>
        <Text style={textStyle}>{desc}</Text>
    </View>
}

export default Failed;

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
});
