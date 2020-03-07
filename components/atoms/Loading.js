// @flow
import React from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import { ORANGE, BLACK } from "../../styles/colors";

const Loading = (props: { desc :String }) => {
    const { desc = "Loading" } = props;
    const { content, textStyle } = styles;
    return (
        <View style={content}>
            <ActivityIndicator color={ORANGE} size={50} />
            <Text style={textStyle}>{desc}</Text>
        </View>
    )
}

export default Loading;

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