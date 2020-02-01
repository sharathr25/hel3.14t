import React from "react";
import { StyleSheet, Modal, View, Text } from "react-native";
import Button from './button';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from "../../constants/styleConstants";

const CustomModal = (props) => {
    const { children = <Text style={{ color: "#000" }}>Loading</Text>, onClose } = props;
    const { outerContainer, innerContainer } = styles;
    return (
        <Modal>
            <View style={outerContainer}>
                <View style={innerContainer}>
                    {children}
                    {onClose && <View style={{height: 60}}><Button onPress={onClose} bgColor={FLAG_COLOR_ORANGE} textColor={FLAG_COLOR_WHITE} >Close</Button></View>}
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
    }
});
