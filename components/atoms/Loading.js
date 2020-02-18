import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { ORANGE, BLACK } from "../../styles/colors";

const Loading = (props) => {
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
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: BLACK,
        fontSize: 20
    },
});