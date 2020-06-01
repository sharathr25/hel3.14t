import React from "react";
import { View, StyleSheet } from "react-native"
import { Heading, Button } from "../atoms"
import { LIGHTEST_GRAY } from "../../styles/colors"
import { openMapsAppWithLatLng } from "../../utils"
import { margin } from "../../styles/mixins";

const EventLocation = ({latitude, longitude}) => {
    const handleNavigate = () => {
        openMapsAppWithLatLng(latitude, longitude)
    }

    const { container } = styles;

    return (
        <View style={container}>
            <Heading>Help request Location</Heading>
            <Button bgColor={LIGHTEST_GRAY} onPress={handleNavigate}>Navigate</Button>
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