
import React from "react";
import { Text } from "native-base"
import { getTimeDiffrence } from "../../utils";

const TimeAndDistance = (props) => {
    const { timeStamp, distance } = props
 
    return (
        <Text note>
            {getTimeDiffrence(new Date(timeStamp).getTime()) === " ago" ? "just now" : getTimeDiffrence(new Date(timeStamp).getTime())} - {`${distance ? distance.toFixed(1) : 0} KM Away`}
        </Text>
    );
}

export default TimeAndDistance;