// @flow
import React from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ORANGE, WHITE, LIGHT_ORANGE, LIGHT_GREEN, GREEN, LIGHT_RED, RED } from "../../styles/colors";
import { Heading } from "../atoms";
import { FONT_SIZE_20 } from "../../styles/typography";
import Icon from 'react-native-vector-icons/FontAwesome';

type CustomModalProps = {
    onClose: Function, 
    variant: "loading" | "success" | "error",
    desc: string,
    buttonText: string
}

const CustomModal = (props: CustomModalProps) => {
    const { onClose, variant = "loading", desc, buttonText="close" } = props;
    const { outerContainer, content, variantContainer } = styles;
    const message = desc ? <Heading size={FONT_SIZE_20}>{desc}</Heading> : null

    const variants = {
        loading: {
            icon: (
                <View style={{...variantContainer, backgroundColor: LIGHT_ORANGE }}>
                    <ActivityIndicator color={ORANGE} size={80} />
                </View>
            ) ,
            CTA: null
        },
        success: {
            icon: (
                <View style={{ ...variantContainer, backgroundColor: LIGHT_GREEN }}>
                    <View style={{ ...variantContainer, width: 80, height: 80, backgroundColor: GREEN, borderRadius: 40 }}>
                        <Icon name="check" color={WHITE} size={50}></Icon>
                    </View>
                </View>
            ) ,
            CTA: (
                <TouchableOpacity onPress={onClose} style={{backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <Heading color={WHITE} size={20}>{buttonText}</Heading>
                </TouchableOpacity>
            )
        },
        error: {
            icon: (
                <View style={{ ...variantContainer, backgroundColor: LIGHT_RED}}>
                    <View style={{ ...variantContainer, width: 80, height: 80, backgroundColor: RED, borderRadius: 40 }}>
                        <Icon name="check" color={WHITE} size={50}></Icon>
                    </View>
                </View>
            ) ,
            CTA: (
                <TouchableOpacity onPress={onClose} style={{backgroundColor: RED, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <Heading color={WHITE} size={20}>{buttonText}</Heading>
                </TouchableOpacity>
            )
        },
    }

    return (
        <View style={outerContainer}>
                <View style={content}>
                    {variants[variant].icon}
                    <View style={{ marginTop: 30 }}>
                        {message}
                    </View>
                </View>
                <View style={{flex: 1, padding: 20 }}>
                    {onClose && variants[variant].CTA}
                </View>
            </View>
    );
}

export default CustomModal;

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: WHITE,
        flex: 1,
    },
    content: {
        flex: 8, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    variantContainer: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
