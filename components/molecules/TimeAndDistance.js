
import React from "react";
import { StyleSheet } from "react-native";
import { Time, Distance } from "../atoms";
import { View, Text } from "native-base"

const TimeAndDistance = (props) => {
    const { timeStamp, distance } = props
    const { timeAndDistance } = styles;

    return (
        <View style={timeAndDistance}>
            <Time time={new Date(timeStamp).getTime()} />
            <Distance distance={distance} />
        </View>
    );
}

export default TimeAndDistance;

const styles = StyleSheet.create({
    timeAndDistance: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
