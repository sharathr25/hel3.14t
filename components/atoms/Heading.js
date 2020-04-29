import React from "react";
import { Text } from 'react-native';
import { BLACK } from "../../styles/colors";
import { FONT_BOLD, FONT_SIZE_14 } from "../../styles/typography";

type HeadingProps = {
    children: React.ReactElement, color: string, size: number
}

const Heading = ({children, color, size }: HeadingProps) => {
    return (
        <Text style={{ ...FONT_BOLD, color, fontSize: size }}>{children}</Text>
    );
}

Heading.defaultProps = {
    color: BLACK, 
    size: FONT_SIZE_14
}

export default Heading;