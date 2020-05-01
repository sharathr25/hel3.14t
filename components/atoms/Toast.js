import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Animated, Dimensions, StyleSheet } from "react-native";
import { WHITE, GREEN, LIGHT_GREEN, LIGHT_GRAY, LIGHTEST_GRAY, 
    LIGHT_BLUE, LIGHT_BLUE_2, YELLOW, LIGHT_YELLOW, RED, LIGHT_RED, BLACK } from "../../styles/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const heightOfToast = 50;
const heightOfToastFooter = 5;

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
        "success" : {
            lineColor: LIGHT_GREEN,
            bgColor: GREEN,
            messageText: message || "Success"
        },
        "info" : {
            lineColor: LIGHT_BLUE_2,
            bgColor: LIGHT_BLUE,
            messageText: "Info"
        },
        "warning" : {
            lineColor: LIGHT_YELLOW,
            bgColor: YELLOW,
            messageText: "Warning"
        },
        "danger" : {
            lineColor: LIGHT_RED,
            bgColor: RED,
            messageText: "Error"
        },
        "default": {
            lineColor: LIGHTEST_GRAY,
            bgColor: LIGHT_GRAY,
            messageText: "Default"
        },
        "loading": {
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
        if(type === "loading") moveLine();
    }, [type])

    const showToast = () => {
        Animated.timing(yValue, {
            toValue: 0,
            duration: DURATION_FOR_Y,
            useNativeDriver: true
        }).start(type !== "loading" ? hideLine() : () => {})
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

    const { container } = styles;

    return (
        <View style={container}>
            <Animated.View style={{
                backgroundColor: bgColor,
                height: heightOfToast,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                transform: [{ translateY: yValue.interpolate({
                        inputRange: [-1, 0],
                        outputRange: [-heightOfToast, 0]
                    })       
                }]
            }}>
                <View style={{flex: 8, marginLeft: 20 }}>
                    <Text style={{color: WHITE}}>{messageText}</Text>
                </View>
                {
                !autoClose && type !== "loading" && (
                        <TouchableOpacity style={{flex: 1}} onPress={closeXToast}>
                            <Icon name="close" size={25}></Icon>
                        </TouchableOpacity>
                    )
                }
            </Animated.View>
            {type === "loading" 
                ?   <Animated.View style={{
                        flex: 1, 
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
                        </View>
                    </Animated.View>
                :   <Animated.View style={{
                        backgroundColor: lineColor,
                        height: heightOfToastFooter ,
                        transform: [{ translateX: xValue.interpolate({
                                inputRange: [-1, 0],
                                outputRange: [-windowWidth, 0]
                            }) 
                        }]
                    }} />
            }
        </View>
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
        top: 0, 
        right: 0, 
        left: 0
    },
})