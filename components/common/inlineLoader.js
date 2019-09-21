import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { FLAG_COLOR_ORANGE, FLAG_COLOR_WHITE } from '../../constants/styleConstants';

const Loader = (props) => {
    return (
        <View style={{display:"flex", flexDirection:"row", backgroundColor:FLAG_COLOR_ORANGE, padding:10, borderRadius:5, margin:10 }}>
            <ActivityIndicator color={FLAG_COLOR_WHITE} />
            <View style={{display:"flex", paddingLeft:5 }}>
                {props.title && <Text style={{color: FLAG_COLOR_WHITE, fontSize:20}}>{props.title}</Text>}
                {props.message && <Text style={{color: FLAG_COLOR_WHITE, fontSize:15}}>{props.message}</Text>}
            </View>
        </View>
    );
}

export default Loader;