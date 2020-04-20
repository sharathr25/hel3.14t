// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { Time, Status } from "../atoms";

const TimeAndStatus = ({ timeStamp, status } : { timeStamp: number, status: string }) => {
    const { timeAndDistance } = styles;

    return (
        <View style={timeAndDistance}>
            <Time time={new Date(timeStamp).getTime()} />
            <Status>{status}</Status>
        </View>
    );
}

export default TimeAndStatus;

const styles = StyleSheet.create({
    timeAndDistance: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5
    }
});
