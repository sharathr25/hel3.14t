import React, {useState} from "react";
import { View, Alert, StyleSheet, Picker, Text } from 'react-native';
import { WHITE, BLACK, ORANGE } from "../../styles/colors";
import { FONT_WEIGHT_REGULAR } from "../../styles/typography";
import { margin } from "../../styles/mixins";

const Selector = (props) => {
    const { options, label="", onValueChange, defaultValue = options[0].value } = props;
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const { labelStyle, pickerContainerStyle } = styles;
    
    const _onValueChange = (value, index) => {
        setSelectedValue(value);
        onValueChange(value);
    }

    return (
        <View>
            <Text style={labelStyle}>{label}</Text>
            <View style={pickerContainerStyle}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={_onValueChange}
                >
                    {options.map(({label, value}) => <Picker.Item label={label} value={value} key={label} />)}
                </Picker>
            </View>
        </View>
    );
}

export  default Selector;

const styles = StyleSheet.create({
    labelStyle: {
        backgroundColor: WHITE,
        zIndex: 2,
        left: 40,
        top: 5,
        alignSelf: 'flex-start',
        position: 'absolute',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 20,
        color: BLACK,
        fontWeight: FONT_WEIGHT_REGULAR
    },
    pickerContainerStyle: {
        borderColor: ORANGE,
        borderWidth: 1.5,
        ...margin(20,0,10,0),
        borderRadius: 10,
    }
})