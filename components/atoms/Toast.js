import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { WHITE, GREEN, LIGHT_GREEN, LIGHT_GRAY, LIGHTEST_GRAY, LIGHT_BLUE, LIGHT_BLUE_2, YELLOW, LIGHT_YELLOW, RED, LIGHT_RED } from "../../styles/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const Toast = ({ type = "success", message = "Success" , autoClose = true, duration = 2000, top = 0 }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const yValue  = useRef(new Animated.Value(-1)).current;
    const xValue = useRef(new Animated.Value(0)).current;
    const [bgColor, setBgColor] = useState("")
    const [lineColor, setLineColor] = useState("")
    const DURATION_FOR_Y = 500;
    const DURATION_FOR_X = duration;

    useEffect(() => {
        if(type === "success") {
            setBgColor(GREEN)
            setLineColor(LIGHT_GREEN)
        } else if (type === "info") {
            setBgColor(LIGHT_BLUE)
            setLineColor(LIGHT_BLUE_2)
        } else if(type === "warning") {
            setBgColor(YELLOW)
            setLineColor(LIGHT_YELLOW)
        } else if(type === "danger") {
            setBgColor(RED)
            setLineColor(LIGHT_RED)
        } else {
            setBgColor(LIGHT_GRAY)
            setLineColor(LIGHTEST_GRAY)
        }
        showToast()
    }, [])

    const showToast = () => {
        Animated.timing(yValue, {
            toValue: 0,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start(hideLine())
    }

    const hideLine = () => {
        Animated.timing(xValue, {
            toValue: -1,
            duration: DURATION_FOR_X,
            useNativeDriver: true
        }).start(autoClose ? closeToast() : () => {})
    }

    const closeToast = () => {
        setTimeout(() => {
            Animated.timing(yValue, {
                toValue: -1,
                duration: DURATION_FOR_Y,
                useNativeDriver: true
            }).start()
        }, DURATION_FOR_X)
    }

    const closeXToast = () => {
        Animated.timing(yValue, {
            toValue: -1,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start()
    }

    return <View style={{ position: 'absolute' , zIndex: 2, top: top, right: 0, left: 0 }}>
    <Animated.View style={{
       backgroundColor: bgColor,
       height: 50,
       justifyContent: 'center',
       alignItems: 'center',
       flexDirection: 'row',
       transform: [{ translateY: yValue.interpolate({
           inputRange: [-1, 0],
           outputRange: [-50 - top, 0]
       }) }]
    }}>
        <View style={{flex: 8, marginLeft: 20 }}>
            <Text style={{color: WHITE}}>{message}</Text>
        </View>
        {!autoClose && <TouchableOpacity style={{flex: 1}} onPress={closeXToast}>
            <Icon name="close" size={25}></Icon>
        </TouchableOpacity>}
    </Animated.View>
    <Animated.View style={{
       backgroundColor: lineColor,
       height: 10 ,
       transform: [{ translateX: xValue.interpolate({
           inputRange: [-1, 0],
           outputRange: [-windowWidth, 0]
       }) }]
    }}>
        </Animated.View>
    </View>
}

export default Toast;