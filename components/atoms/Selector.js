import React, {useState} from "react";
import { StyleSheet } from 'react-native';
import { WHITE, BLACK, ORANGE } from "../../styles/colors";
import { FONT_SIZE_18 } from "../../styles/typography";
import { View, Picker, Label} from 'native-base'

const Selector = (props) => {
    const { options, label="", onValueChange } = props;
    const [selectedValue, setSelectedValue] = useState(options[0].value);
    const { labelStyle, pickerContainerStyle } = styles;
    
    const _onValueChange = (value) => {
        setSelectedValue(value);
        onValueChange(value);
    }

    return (
        <View>
            <Label style={labelStyle}>{label}</Label>
            <View style={pickerContainerStyle}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={_onValueChange}
                    mode="dropdown"
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
        left: 20, 
        top: 10, 
        paddingHorizontal: 10, 
        textAlign: 'center',
        color: BLACK,
        fontSize:FONT_SIZE_18,
        alignSelf: 'flex-start'
    },
    pickerContainerStyle: {
        borderColor: ORANGE,
        borderWidth: 1,
        borderRadius: 5,
    }
})