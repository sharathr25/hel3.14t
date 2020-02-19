// @flow
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ORANGE, WHITE } from '../../styles/colors';

const FullScreenLoader = (props: { text: string }) => {
    const { text = "Loading" } = props;
    const { container, textStyle } = styles;
    return (
        <View style={container}>
            <ActivityIndicator size={25} color={ORANGE} />
            <Text style={textStyle}>{text}</Text>
        </View>
    );
}

export default FullScreenLoader;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: WHITE
    },
    textStyle: {
        fontSize: 25
    }
});