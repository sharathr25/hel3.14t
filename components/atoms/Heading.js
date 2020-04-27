import React from "react";
import { Text } from 'react-native';
import { BLACK } from "../../styles/colors";
import { FONT_BOLD, FONT_SIZE_14 } from "../../styles/typography";

const Heading = ({children, color = BLACK, size = FONT_SIZE_14 }: { children: React.ReactElement, color: string, size: number }) => {
    return (
        <Text style={{ ...FONT_BOLD, color, fontSize: size }}>{children}</Text>
    );
}

export default Heading;