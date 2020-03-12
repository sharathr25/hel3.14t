import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff, pushToFirebaseWithURL, getDataFromFirebase, updateFirebaseWithURL } from '../../fireBase/database';
import { ORANGE, FONT_FAMILY } from '../../styles/colors';
import Time from '../../components/common/time';
import  Icon from 'react-native-vector-icons/FontAwesome';

class Comments extends Component {
    static navigationOptions = {
        title: 'Comments',
        headerRight:null
    };

    render() {
        return (
            <View style={{flex:1}}>
                <Text>Comments</Text>
            </View>
    );
  }
}

export default Comments;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 15,
        flex:0.1
      },
      input: {
        flex: 1,
        height: 40,
        fontSize: 15,
      },
      button: {
        height: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      inactive: {
        color: '#CCC',
      },
      text: {
        color: ORANGE,
        fontWeight: 'bold',
        fontFamily: 'Avenir',
        textAlign: 'center',
        fontSize: 15,
      },
});
