import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Link, Heading , Button } from "../atoms";
import { BLACK, ORANGE, WHITE } from "../../styles/colors";
import { margin } from "../../styles/mixins";
import { InputComponent } from ".";
import Icon from "react-native-vector-icons/FontAwesome";

const heightOfOTPToast = 135;
const DURATION_FOR_Y = 500;

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
    const yValue  = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        if(show) showOTPToast()
        else closeOTPToast()
    }, [show])

    const showOTPToast = () => {
        Animated.timing(yValue, {
            toValue: 0,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start()
    }

    const closeOTPToast = () => {
        Animated.timing(yValue, {
            toValue: -1,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start()
    }

    const { container, innerContainer, resendMessage } = styles;
    return (
        <View style={container}>
        <Animated.View style={{
            backgroundColor: WHITE,
            height: heightOfOTPToast,
            justifyContent: 'center',
            transform: [{ translateY: yValue.interpolate({
                    inputRange: [-1, 0],
                    outputRange: [-heightOfOTPToast, 0]
                })       
            }]
        }}>
            <View style={innerContainer}>
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
    </View>
    )
}

export default OTPVerificationModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position:'absolute', 
        left: 0, right: 0, top: 0,
        zIndex: 99, 
    },
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