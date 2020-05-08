import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WHITE } from "../../styles/colors";
import { SCREEN_DETAILS } from '../../constants/appConstants';

const { MORE_SCREEN } = SCREEN_DETAILS;

const AccountButton = () => {
    const navigation = useNavigation();

    const _onPress = () => {
      navigation.navigate(MORE_SCREEN.screenName)
    }

    return (
      <TouchableOpacity onPress={_onPress}>
        <Icon name="account-circle" size={25} color={WHITE}/>
      </TouchableOpacity>
    );
}

export default AccountButton;