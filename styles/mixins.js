
// @flow
import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const guidelineBaseWidth = 375;

export const scaleSize = (size: number) => (WINDOW_WIDTH / guidelineBaseWidth) * size;

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

const dimensions = (top, right = top, bottom = top, left = right, property) => {
    let styles = {};

    styles[`${property}Top`] = top;
    styles[`${property}Right`] = right;
    styles[`${property}Bottom`] = bottom;
    styles[`${property}Left`] = left;

    return styles;
}

export const margin = (top: number, right: number, bottom: number, left: number) => {
    return dimensions(top, right, bottom, left, 'margin');
}

export const padding = (top: number, right: number, bottom: number, left: number) => {
    return dimensions(top, right, bottom, left, 'padding');
}
export const borderRadius = (topLeft: number, topRight: number, bottomRight: number, bottomLeft: number) => {
    let styles = {};

    styles["borderTopLeftRadius"] = topLeft;
    styles["borderTopRightRadius"] = topRight;
    styles["borderBottomLeftRadius"] = bottomLeft;
    styles["borderBottomRightRadius"] = bottomRight;
    
    return styles;
}

export const boxShadow = (color: string , offset:{ height: number, width: number} = { height: 2, width: 2 },
    radius: number = 8, opacity: number = 0.2) => {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}