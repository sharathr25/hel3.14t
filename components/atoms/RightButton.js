import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GREEN } from '../../styles/colors';

const RightButton = props => {
    const { onPress, loading = false } = props;
    const { accept } = styles;

    return (
        <TouchableOpacity style={accept} onPress={onPress}>
            {
                loading
                    ? <ActivityIndicator size={20} color={GREEN} />
                    : <Icon name="check" size={20} color={GREEN} />
            }
        </TouchableOpacity>
    );
};

export default RightButton;

const styles = StyleSheet.create({
    accept: {
        width: 40,
        height: 40,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: GREEN,
        borderRadius: 20
    },
});