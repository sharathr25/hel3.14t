import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { RED, ORANGE, GREEN, WHITE, LIGHT_RED, LIGHT_ORANGE, LIGHT_GREEN } from '../../styles/colors';
import { FONT_REGULAR, FONT_SIZE_14, FONT_BOLD } from '../../styles/typography';
import { padding } from '../../styles/mixins';

export const STATUS_TEXT_MAPPING = {
    'REQUESTED': 'Requested',
    'ON_GOING': 'On going',
    'COMPLETED': 'Completed'
}

export const STATUS_COLOR_MAPPING = {
    'REQUESTED': RED,
    'ON_GOING': ORANGE,
    'COMPLETED': GREEN
}

export const STATUS_LIGHT_COLOR_MAPPING = {
    'REQUESTED': LIGHT_RED,
    'ON_GOING': LIGHT_ORANGE,
    'COMPLETED': LIGHT_GREEN
}

 const Status = (props) => {
    const { children } = props;
    const { container } = styles;

    return (
        <View style={{ ...container, backgroundColor: STATUS_LIGHT_COLOR_MAPPING[children] }}>
            <Text style={{ color: STATUS_COLOR_MAPPING[children] , textAlign: 'center', ...FONT_BOLD, fontSize: FONT_SIZE_14 }}>{STATUS_TEXT_MAPPING[children]}</Text>
        </View>
    );
}

export default Status;

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        alignSelf: 'flex-start',
        ...padding(3,7,3,7)
    }
});