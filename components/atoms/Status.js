import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { FONT_SIZE_14, FONT_BOLD } from '../../styles/typography';
import { padding } from '../../styles/mixins';
import { STATUS_MAPPING } from '../../constants/appConstants';

const Status = (props) => {
    const { children } = props;
    const { container, textStyle } = styles;

    return (
        <View style={{ ...container, backgroundColor: STATUS_MAPPING[children].lightColor }}>
            <Text style={{ ...textStyle , color: STATUS_MAPPING[children].color }}>
                {STATUS_MAPPING[children].text}
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