import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { BLACK, FLAG_COLOR_ORANGE } from '../constants/styleConstants';

const ScreenRedirecter = (props) => {
    const { title , buttonText, handleRedirection } = props;
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ paddingTop: 12, color: BLACK }}>{title}</Text>
            <Button titleStyle={{ color: FLAG_COLOR_ORANGE }} type="clear" title={buttonText} onPress={handleRedirection} />
        </View>
    );
}

export default ScreenRedirecter;