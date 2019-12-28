import React from 'react';
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FLAG_COLOR_ORANGE } from '../../constants/styleConstants';

const MenuIcon = (props) => {
    const { navigation } = props;

    return (
        <TouchableOpacity>
            <Icon name="navicon" size={25} color={FLAG_COLOR_ORANGE} style={{ paddingLeft: 15 }} onPress={navigation.toggleDrawer} />
        </TouchableOpacity>
    );
}

export default MenuIcon;