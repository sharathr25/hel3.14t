import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Link, Heading , Button } from "../atoms";
import { BLACK, ORANGE, WHITE } from "../../styles/colors";
import { margin } from "../../styles/mixins";
import { InputComponent } from ".";
import Icon from "react-native-vector-icons/FontAwesome";

const HEIGHT_OF_TOAST = 150;
const DURATION_FOR_Y = 500;

type OTPVerificationModalProps = {
    recepient: String, 
    verify: Function, 
    resend: Function, 
    setOtp: Function,
    onClose: Function,
    show: Boolean
}

const OTPVerificationToast = (props: OTPVerificationModalProps) => {
    const { recepient, verify, setOtp , resend, show, onClose = () => {} } = props; 
    const yValue  = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        if(show) showOTPToast()
        else closeOTPToast()
    }, [show])

    const showOTPToast = () => {
        animate(0)
    }

    const closeOTPToast = () => {
        animate(-1)
    }

    const animate = (_toValue) => {
        Animated.timing(yValue, {
            toValue: _toValue,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start()
    }

    const { innerContainer, resendMessage } = styles;
    
    return (
        <Animated.View style={{
            height: HEIGHT_OF_TOAST,
            justifyContent: 'center',
            flex: 1,
            position:'absolute', 
            left: 0, right: 0, top: 0,
            zIndex: 99,
            transform: [{ translateY: yValue.interpolate({
                    inputRange: [-1, 0],
                    outputRange: [-HEIGHT_OF_TOAST, 0]
                })       
            }],
        }}>
            <View style={innerContainer}>
                <TouchableOpacity onPress={onClose} style={{position: 'absolute', top:0, right:15}}>
                    <Icon name="remove" size={30} />
                </TouchableOpacity>
                <Heading>Enter OTP sent to {recepient}</Heading>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5}}>
                    <View style={{flex: 1}}>
                        <InputComponent label="OTP" updateParentState={setOtp} />
                    </View>
                    <View style={{...margin(11,0,12.5,5)}}>
                        <Button onPress={verify} bgColor={ORANGE} textColor={WHITE}>verify</Button>
                    </View>
                </View>
                <View style={resendMessage}>
                    <Text style={{color: BLACK}}>Haven’t received OTP? </Text>
                    <Link onPress={resend}>Resend</Link> 
                </View>
            </View>
        </Animated.View>
    )
}

export default OTPVerificationToast;

const styles = StyleSheet.create({
    innerContainer: {
        backgroundColor: WHITE, 
        flex: 1,
        padding: 10,
        alignItems:'center',
        borderBottomColor: BLACK,
        borderBottomWidth: 2
    },
    closeButton: {
        margin: 5, position: 'absolute', right: 0
    },
    resendMessage: {
        flexDirection: 'row',
    }
})