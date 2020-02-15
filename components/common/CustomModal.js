import React from "react";
import { StyleSheet, Modal, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { ORANGE, WHITE, BLACK, GREEN, RED } from "../../constants/styleConstants";
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomModal = (props) => {
    const { onClose, variant = "loading", desc } = props;
    const { outerContainer, innerContainer, textStyle, content, closeButton, closeButtonText, descStyle } = styles;

    const Loading = () => (
        <View style={content}>
            <ActivityIndicator color={ORANGE} size={50} />
            <Text style={textStyle}>Loading</Text>
        </View>
    );

    const Success = () => (
        <View style={content}>
            <Icon name="check-circle" color={GREEN} size={50}></Icon>
            <Text style={textStyle}>Success</Text>
            {desc && <Text style={descStyle}>{desc}</Text>}
        </View>
    )

    const Failed = () => {
        <View style={content}>
            <Icon name="times-circle" color={RED} size={50}></Icon>
            <Text style={textStyle}>Failed</Text>
        </View>
    }

    const variants = {
        loading: <Loading />,
        success: <Success />,
        error: <Failed />,
    }

    return (
        <Modal>
            <View style={outerContainer}>
                <View style={innerContainer}>
                    {variants[variant]}
                    {onClose &&
                        <TouchableOpacity onPress={onClose} style={closeButton}>
                            <Text style={closeButtonText}>Close</Text>
                        </TouchableOpacity>}
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
    },
    content: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: BLACK,
        fontSize: 20
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
    descStyle: {
        textAlign: 'center',
    }
});
