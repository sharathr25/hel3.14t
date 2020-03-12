import React from 'react';
import {TouchableOpacity} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";

const PasswordIcon = ({showPassword, setShowPassword}) => (
    <TouchableOpacity onPress={setShowPassword}>
        {showPassword ? <Icon name="md-eye-off" size={22} /> : <Icon name="md-eye" size={22} onPress={setShowPassword} />}
    </TouchableOpacity>
);

export default PasswordIcon;