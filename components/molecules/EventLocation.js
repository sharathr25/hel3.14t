import React from "react";
import { View } from "react-native"
import { Heading, Button } from "../atoms"
import { LIGHTEST_GRAY } from "../../styles/colors"
import { openMapsAppWithLatLng } from "../../utils"
import { margin } from "../../styles/mixins";

const EventLocation = ({latitude, longitude}) => {
    const handleNavigate = () => {
        openMapsAppWithLatLng(latitude, longitude)
    }

    return (
        <View 
            style={{ 
                backgroundColor: LIGHTEST_GRAY, 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 10,
                ...margin(10,0,10,0),
            }}
        >
            <Heading>Event Location</Heading>
            <Button bgColor={LIGHTEST_GRAY} onPress={handleNavigate}>Navigate</Button>
        </View>
    );
}

export default EventLocation;