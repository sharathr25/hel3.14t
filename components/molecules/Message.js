import React from "react";
import { View, ActivityIndicator } from "react-native"
import { Heading } from "../atoms"
import { LIGHT_GRAY, LIGHTEST_GRAY } from "../../styles/colors"
import { FONT_SIZE_20 } from "../../styles/typography"

const Message = ({children, loading = false, bgColor = LIGHTEST_GRAY, messageColor = LIGHT_GRAY}) => {
    return (
        <View style={{ backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {loading && <><ActivityIndicator size={20} color={messageColor} /><View style={{width: 10 }}/></>}
            <Heading color={messageColor} size={FONT_SIZE_20}>{children}</Heading>
        </View>
    )
}

export default Message;