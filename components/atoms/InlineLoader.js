import React from 'react'
import { View, ActivityIndicator } from "react-native";
import Heading from "./Heading";
import { LIGHT_GRAY } from "../../styles/colors";

const InlineLoader = (props) => {
    const { size = 20, color = LIGHT_GRAY, message = "Please wait..." } = props;
    return (
        <View style={{ flexDirection: "row", justifyContent: 'center' }}>
            <ActivityIndicator color={color} size={size} />
            <View style={{ width: 10 }} />
            <Heading size={size} color={color}>{message}</Heading>
        </View>
    )
}

export default InlineLoader;