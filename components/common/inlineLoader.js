import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { ORANGE, WHITE } from '../../constants/styleConstants';

const Loader = (props) => {
    const { bgColor = ORANGE, color = WHITE, title, message } = props;
    const { container, content } = styles;
    return (
        <View style={{ ...container,backgroundColor: bgColor, borderColor: color}}>
            <ActivityIndicator color={color} />
            <View style={content}>
                {title && <Text style={{ color: color, fontSize: 20 }}>{title}</Text>}
                {message && <Text style={{ color: color, fontSize: 15 }}>{message}</Text>}
            </View>
        </View>
    );
}

export default Loader;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        borderWidth: 1
    },
    content: {
        display: "flex", 
        paddingLeft: 5 
    }
});