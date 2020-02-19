// @flow
import React from "react";
import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import { ORANGE, WHITE } from "../../styles/colors";
import { Loading, Failed, Success, Button } from "../atoms";

type CustomModalProps = {
    onClose: Function, 
    variant: "loading" | "success" | "error",
    desc: string
}

const CustomModal = (props: CustomModalProps) => {
    const { onClose, variant = "loading", desc } = props;
    const { outerContainer, innerContainer, closeButton, closeButtonText } = styles;

    const variants = {
        loading: <Loading desc={desc}/>,
        success: <Success desc={desc} />,
        error: <Failed desc={desc} />,
    }

    return (
        <Modal>
            <View style={outerContainer}>
                <View style={innerContainer}>
                    {variants[variant]}
                    {onClose && <Button onPress={onClose}>Close</Button>}
                </View>
            </View>
        </Modal>
    );
}

export default CustomModal;

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: "#636363",
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10
    },
    closeButton: {
        backgroundColor: ORANGE,
        alignSelf: 'stretch',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 10,
        marginTop: 10
    },
    closeButtonText: {
        color: WHITE,
        textAlign: 'center',
        fontSize: 20
    },
});
