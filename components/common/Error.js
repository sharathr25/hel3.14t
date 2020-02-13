import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RED, WHITE } from '../../constants/styleConstants';
import Icon from 'react-native-vector-icons/FontAwesome';

const Error = (props) => {
    const { text = "Something went wrong, please try again later..." } = props;
    const { container, textStyle, icon } = styles;
    return (
        <View style={container}>
            <View style={icon}>
                <Icon size={25} color={WHITE} name="exclamation" />
            </View>
            <Text style={textStyle}>{text}</Text>
        </View>
    );
}

export default Error;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    textStyle: {
        fontSize: 25,
        textAlign: 'center'
    },
    icon: {
        backgroundColor: RED,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
});