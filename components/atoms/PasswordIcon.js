import React from 'react';
import {TouchableOpacity} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";

const PasswordIcon = ({showPassword, setShowPassword}) => (
    <TouchableOpacity onPress={setShowPassword}>
        <Icon name={`md-eye${showPassword ? "-off" : ""}`} size={22} />
    </TouchableOpacity>
);

export default PasswordIcon;