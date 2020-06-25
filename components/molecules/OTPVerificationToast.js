import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Link, Heading , Button } from "../atoms";
import { BLACK, ORANGE, WHITE } from "../../styles/colors";
import { margin } from "../../styles/mixins";
import { Input } from ".";
import Icon from "react-native-vector-icons/FontAwesome";

const { height } = Dimensions.get('window');
const heightOfHeader = 60;
const HEIGHT_OF_TOAST = height - heightOfHeader;
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

    const { innerContainer, resendMessage, closeButton } = styles;

    return (
        <Animated.View style={{
            height: HEIGHT_OF_TOAST,
            justifyContent: 'center',
            backgroundColor: "#3333337d",
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
                <TouchableOpacity onPress={onClose} style={closeButton}>
                    <Icon name="remove" size={30} />
                </TouchableOpacity>
                <Text>Enter OTP sent to</Text>
                <Heading>{recepient}</Heading>
                <Input label="OTP" onChangeText={setOtp} keyboardType="numeric" />
                <Button onPress={verify} bgColor={ORANGE} textColor={WHITE}>verify</Button>
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
        flex: 0.3, 
        backgroundColor: WHITE, 
        alignItems: 'center', 
        padding: 10, 
        ...margin(0,20,0,20)
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    resendMessage: {
        flexDirection: 'row',
    }
})