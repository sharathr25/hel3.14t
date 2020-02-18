import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { RED, ORANGE, GREEN, WHITE } from '../../styles/colors';
import { FONT_REGULAR, FONT_SIZE_14 } from '../../styles/typography';
import { padding } from '../../styles/mixins';

const STATUS_TEXT_MAPPING = {
    'REQUESTED': 'Requested',
    'ON_GOING': 'On going',
    'COMPLETED': 'Completed'
}

const STATUS_COLOR_MAPPING = {
    'REQUESTED': RED,
    'ON_GOING': ORANGE,
    'COMPLETED': GREEN
}

 const Status = (props) => {
    const { children } = props;
    const { container } = styles;

    return (
        <View style={{ ...container, backgroundColor: STATUS_COLOR_MAPPING[children] }}>
            <Text style={{ color: WHITE, textAlign: 'center', ...FONT_REGULAR, fontSize: FONT_SIZE_14 }}>{STATUS_TEXT_MAPPING[children]}</Text>
        </View>
    );
}

export default Status;

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        alignSelf: 'flex-start',
        ...padding(5,5,5,5)
    }
});