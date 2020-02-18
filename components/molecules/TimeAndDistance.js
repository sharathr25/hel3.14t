import React from "react";
import { View, StyleSheet } from "react-native";
import { Time, Distance } from "../atoms";

const TimeAndDistance = ({ timeStamp, distance }) => {
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
