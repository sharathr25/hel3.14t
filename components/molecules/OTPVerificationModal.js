// @flow
import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
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
    return (
        <Modal isVisible={show}>
            <View style={{flex: 1, justifyContent: 'center' }}>
                <View style={{ backgroundColor: WHITE, ...margin(100,10,100,10), padding: 10, justifyContent: 'space-evenly', alignItems: 'center', margin: 10 }}>
                <TouchableOpacity style={{ margin: 5, position: 'absolute', right: 0 }} onPress={onClose}>
                    <Icon name="remove" size={25}></Icon>
                </TouchableOpacity>
                <Heading>Enter OTP sent to {recepient}</Heading>
                <View style={{height: 10}} />
                    <InputComponent label="OTP" updateParentState={setOtp} />
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
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