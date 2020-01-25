import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { STATUS_COLOR_MAPPING, FLAG_COLOR_WHITE } from '../../constants/styleConstants';
import { STATUS_TEXT_MAPPING } from '../../constants/appConstants';

const Status = (props) => {
    const { children } = props;
    const { container } = styles;
    return (
        <View style={{ ...container, backgroundColor: STATUS_COLOR_MAPPING[children] }}>
            <Text style={{ color: FLAG_COLOR_WHITE, textAlign: 'center', fontWeight: '900' }}>{STATUS_TEXT_MAPPING[children]}</Text>
        </View>
    );
}

export default Status;

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        width: 100,
        padding: 1,
    }
});