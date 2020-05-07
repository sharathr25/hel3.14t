import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Animated, Dimensions, StyleSheet } from "react-native";
import { WHITE, GREEN, LIGHT_GREEN, LIGHT_GRAY, LIGHTEST_GRAY, 
    LIGHT_BLUE, LIGHT_BLUE_2, YELLOW, LIGHT_YELLOW, RED, LIGHT_RED } from "../../styles/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const heightOfToast = 55;
const heightOfToastFooter = 5;

export const toastTypes = {
    "LOADING": "loading",
    "SUCCESS": "success",
    "ERROR": "danger",
    "INFO": "info",
    "DEFAULT": "default",
    "WARNING": "warning"
}

const LoadingLine = () => {
    return (
        <View style={{
                height: heightOfToastFooter, 
                backgroundColor: LIGHT_YELLOW, 
                marginHorizontal: 5, 
                flex: 1,
                borderRadius: heightOfToastFooter
            }} 
        />
    )
}

const Toast = (props) => {
    const { type = "success", message = "Success" , autoClose = true, duration = 2000 } = props;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const yValue  = useRef(new Animated.Value(-1)).current;
    const xValue = useRef(new Animated.Value(0)).current;
    const lValue = useRef(new Animated.Value(0)).current;
    const [bgColor, setBgColor] = useState("")
    const [lineColor, setLineColor] = useState("")
    const [messageText, setMessageText] = useState("")
    const DURATION_FOR_Y = 500;
    const DURATION_FOR_X = duration;

    const typeMapping = {
        [toastTypes.SUCCESS] : {
            lineColor: LIGHT_GREEN,
            bgColor: GREEN,
            messageText: message || "Success"
        },
        [toastTypes.INFO] : {
            lineColor: LIGHT_BLUE_2,
            bgColor: LIGHT_BLUE,
            messageText: "Info"
        },
        [toastTypes.WARNING] : {
            lineColor: LIGHT_YELLOW,
            bgColor: YELLOW,
            messageText: "Warning"
        },
        [toastTypes.ERROR] : {
            lineColor: LIGHT_RED,
            bgColor: RED,
            messageText: "Error"
        },
        [toastTypes.DEFAULT]: {
            lineColor: LIGHTEST_GRAY,
            bgColor: LIGHT_GRAY,
            messageText: "Default"
        },
        [toastTypes.LOADING]: {
            lineColor: LIGHT_YELLOW,
            bgColor: YELLOW,
            messageText: "loading"
        }
    }

    useEffect(() => {
        const { bgColor, lineColor, messageText } = typeMapping[type]
        setBgColor(bgColor)
        setLineColor(lineColor)
        setMessageText(message || messageText)
        showToast()
        if(type === toastTypes.LOADING) moveLine();
    }, [type, message])

    const showToast = () => {
        Animated.timing(yValue, {
            toValue: 0,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start(type !== toastTypes.LOADING ? hideLine() : () => {})
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

    const moveLine = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(lValue, {
                    toValue: -1,
                    duration: DURATION_FOR_X,
                    useNativeDriver: true
                }),
                Animated.timing(lValue, {
                    toValue: 0,
                    duration: DURATION_FOR_X,
                    useNativeDriver: true
                }),
            ])
        ).start()  
    }

    return (
            <Animated.View style={{
                backgroundColor: bgColor,
                height: heightOfToast,
                transform: [{ translateY: yValue.interpolate({
                        inputRange: [-1, 0],
                        outputRange: [-heightOfToast, 0]
                    })       
                }],
                position: 'absolute', 
                zIndex: 999, 
                top: 0,
                right: 0, 
                left: 0
            }}>
                <View style={{flex: 8, alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{flex: 8, marginLeft: 20 }}>
                        <Text style={{color: WHITE}}>{messageText}</Text>
                    </View>
                    {
                    !autoClose && type !== toastTypes.LOADING && (
                            <TouchableOpacity style={{flex: 1}} onPress={closeXToast}>
                                <Icon name="close" size={25}></Icon>
                            </TouchableOpacity>
                        )
                    }
                </View>
                {type === toastTypes.LOADING 
                ?   <Animated.View style={{ 
                        height: heightOfToastFooter,
                        transform: [{ translateX: lValue.interpolate({
                            inputRange: [-1, 0],
                            outputRange: [-windowWidth, 0]
                        }) 
                    }] }}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: "center"}}>
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                            <LoadingLine />
                        </View>
                    </Animated.View>
                :   <Animated.View style={{
                        backgroundColor: lineColor,
                        height: heightOfToastFooter ,
                        transform: [{ translateX: xValue.interpolate({
                                inputRange: [-1, 0],
                                outputRange: [-windowWidth, 0]
                            }) 
                        }],
                        flex: 1
                    }} />
            }
            </Animated.View>
    )
}

Toast.defaultProps = {
    type: "default", 
    autoClose: true,
    duration: 2000
}

export default Toast;

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        zIndex: 999, 
        top: -60,
        right: 0, 
        left: 0
    },
})