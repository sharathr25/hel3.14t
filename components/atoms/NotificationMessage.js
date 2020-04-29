import React from 'react'
import { View, Text } from 'react-native'
import { LIGHT_GRAY, BLACK } from '../../styles/colors'
import { FONT_SIZE_14 } from '../../styles/typography'

const NotificationMessage = (props) => {
    const {children, bgColor, messageColor, messageSize } = props;
    return (
        <View style={{backgroundColor: bgColor, padding: 10, alignItems: 'center'}}>
            <Text style={{ color: messageColor, fontSize: messageSize, textAlign: 'center'}}>{children}</Text>
        </View>
    )
}

NotificationMessage.defaultProps = {
    bgColor: LIGHT_GRAY, 
    messageColor: BLACK, 
    messageSize: FONT_SIZE_14
}

export default NotificationMessage;