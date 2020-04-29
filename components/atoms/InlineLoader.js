import React from 'react'
import { View, ActivityIndicator } from "react-native";
import Heading from "./Heading";
import { LIGHT_GRAY, LIGHT_GREEN, LIGHT_RED } from "../../styles/colors";

type InlineLoaderProps = {
    size: number,
    message: String,
    variant: String,
}

const InlineLoader = (props: InlineLoaderProps) => {
    const { size, message, variant } = props;
    const varaintToColorMapping = {
        loading : LIGHT_GRAY,
        success : LIGHT_GREEN,
        error : LIGHT_RED 
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: 'center' }}>
            {variant === "loading" && <ActivityIndicator color={varaintToColorMapping[variant]} size={size} />}
            <View style={{ width: 10 }} />
            <Heading size={size} color={varaintToColorMapping[variant]}>{message}</Heading>
        </View>
    )
}

InlineLoader.defaultProps = {
    size: 20, 
    message: "Please wait...", 
    variant: "loading"   
}

export default InlineLoader;