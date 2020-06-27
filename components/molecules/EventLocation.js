import React from "react";
import { StyleSheet } from "react-native"
import { Heading } from "../atoms"
import { LIGHTEST_GRAY } from "../../styles/colors"
import { openMapsAppWithLatLng } from "../../utils"
import { margin } from "../../styles/mixins";
import { View, Button, Text } from 'native-base'

const EventLocation = ({latitude, longitude}) => {
    const handleNavigate = () => {
        openMapsAppWithLatLng(latitude, longitude)
    }

    const { container } = styles;

    return (
        <View style={container}>
            <Heading>Help request Location</Heading>
            <Button bordered onPress={handleNavigate} primary bordered>
                <Text>Navigate</Text>
            </Button>
        </View>
    );
}

export default EventLocation;

const styles = StyleSheet.create({
    container : {
        backgroundColor: LIGHTEST_GRAY, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 10,
        ...margin(10,0,10,0),
    }
})