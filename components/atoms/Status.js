import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { RED, ORANGE, GREEN, LIGHT_RED, LIGHT_ORANGE, LIGHT_GREEN, GRAY, LIGHT_GRAY } from '../../styles/colors';
import { FONT_SIZE_14, FONT_BOLD } from '../../styles/typography';
import { padding } from '../../styles/mixins';

export const STATUS_TEXT_MAPPING = {
    'REQUESTED': 'Requested',
    'ON_GOING': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
}

export const STATUS_COLOR_MAPPING = {
    'REQUESTED': GRAY,
    'ON_GOING': ORANGE,
    'COMPLETED': GREEN,
    'CANCELLED' : RED
}

export const STATUS_LIGHT_COLOR_MAPPING = {
    'REQUESTED': LIGHT_GRAY,
    'ON_GOING': LIGHT_ORANGE,
    'COMPLETED': LIGHT_GREEN,
    'CANCELLED' : LIGHT_RED
}

 const Status = (props) => {
    const { children } = props;
    const { container, textStyle } = styles;

    return (
        <View style={{ ...container, backgroundColor: STATUS_LIGHT_COLOR_MAPPING[children] }}>
            <Text style={{ ...textStyle , color: STATUS_COLOR_MAPPING[children] }}>
                {STATUS_TEXT_MAPPING[children]}
            </Text>
        </View>
    );
}

export default Status;

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        alignSelf: 'flex-start',
        ...padding(2,10,2,10)
    },
    textStyle: {
        textAlign: 'center', 
        ...FONT_BOLD, 
        fontSize: FONT_SIZE_14
    }
});