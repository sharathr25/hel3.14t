import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ORANGE } from '../../constants/styleConstants';

const Loader = (props) => {
    const { text = "Loading" } = props;
    const { container, textStyle } = styles;
    return (
        <View style={container}>
            <ActivityIndicator size={25} color={ORANGE} />
            <Text style={textStyle}>{text}</Text>
        </View>
    );
}

export default Loader;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    textStyle: {
        fontSize: 25
    }
});