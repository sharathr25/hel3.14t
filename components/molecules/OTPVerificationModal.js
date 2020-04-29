// @flow
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { Link, Heading , Button } from "../atoms";
import { BLACK, ORANGE, WHITE } from "../../styles/colors";
import { margin } from "../../styles/mixins";
import { InputComponent } from ".";
import Icon from "react-native-vector-icons/FontAwesome";

type OTPVerificationModalProps = {
    recepient: String, 
    verify: Function, 
    resend: Function, 
    setOtp: Function,
    onClose: Function,
    show: Boolean
}

const OTPVerificationModal = (props: OTPVerificationModalProps) => {
    const { recepient, verify, setOtp , resend, show, onClose = () => {} } = props; 

    const { container, innerContainer, closeButton, resendMessage } = styles;
    return (
        <Modal isVisible={show}>
            <View style={container}>
                <View style={innerContainer}>
                    <TouchableOpacity style={closeButton} onPress={onClose}>
                        <Icon name="remove" size={25}></Icon>
                    </TouchableOpacity>
                    <Heading>Enter OTP sent to {recepient}</Heading>
                    <InputComponent label="OTP" updateParentState={setOtp} />
                    <View style={resendMessage}>
                        <Text style={{color: BLACK}}>Haven’t received OTP? </Text>
                        <Link onPress={resend}>Resend</Link> 
                    </View>
                    <Button onPress={verify} bgColor={ORANGE} textColor={WHITE}>verify</Button>
                </View>
            </View>
        </Modal>
    )
}

export default OTPVerificationModal;

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center'
    },
    innerContainer: {
        backgroundColor: WHITE, ...margin(100,10,100,10), padding: 10, justifyContent: 'space-evenly', alignItems: 'center', margin: 10
    },
    closeButton: {
        margin: 5, position: 'absolute', right: 0
    },
    resendMessage: {
        flexDirection: 'row', marginBottom: 5, marginTop: 10
    }
})