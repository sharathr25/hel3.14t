// @flow
import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RED, BLACK } from "../../styles/colors";

const Failed = (props: { desc: string }) => {
    const { desc = "Failed" } = props;
    const { content, textStyle } = styles;
    return (
        <View style={content}>
            <Icon name="times-circle" color={RED} size={50}></Icon>
            <Text style={textStyle}>{desc}</Text>
        </View>
    );
}

export default Failed;

const styles = StyleSheet.create({
    content: {
        width: Dimensions.get('window').width/2,
        height: Dimensions.get('window').height/4,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: BLACK,
        fontSize: 20,
        textAlign: 'center'
    },
});
