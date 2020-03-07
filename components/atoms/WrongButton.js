import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RED } from '../../styles/colors';

const WrongButton = (props: { onPress: Function, loading: boolean } ) => {
    const { onPress, loading = false } = props;
    const { reject } = styles;
    
    return (
        <TouchableOpacity style={reject} onPress={onPress}>
            {
                loading
                    ? <ActivityIndicator size={20} color={RED} />
                    : <Icon name="remove" size={20} color={RED} />
            }
        </TouchableOpacity>
    );
};

export default WrongButton;

const styles = StyleSheet.create({
    reject: {
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: RED,
        borderRadius: 20
    }
});