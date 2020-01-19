import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../constants/styleConstants";
import { TouchableOpacity } from "react-native-gesture-handler";
import Context from "../../context";

const NotificationBellIcon = (props) => {
    const { navigation } = props;
    // const contextValues = useContext(Context);
    // const { notifications } = contextValues;
    const notifications = [];
    const { container, textContainer, text } = styles;

    handleBellIconClick = () => {
        navigation.navigate('Notifications');
    }

    return notifications.length
        ? <TouchableOpacity onPress={handleBellIconClick} style={container}>
            <Icon name="bells" size={25} color={FLAG_COLOR_ORANGE} />
            <View style={textContainer}>
                <Text style={text}>{notifications.length}</Text>
            </View>
        </TouchableOpacity>
        : null;
}

export default NotificationBellIcon;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15
    },
    textContainer: {
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        position: 'relative',
        top: 5,
        right: 10
    },
    text: {
        fontSize: 10,
        color: FLAG_COLOR_WHITE,
    }
});
