// @flow
import React from 'react'
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WHITE } from '../../styles/colors';

const BackButton = ({ navigation }: { navigation: Object }) => {
    if(!navigation.canGoBack()) return null; 
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={25} color={WHITE}/>
      </TouchableOpacity>
    );
}

export default BackButton;