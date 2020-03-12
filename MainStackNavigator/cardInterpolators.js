// @flow
import { View, Text, Animated } from 'react-native';

const { multiply } = Animated;

type screenProps = {
  current: Object,
  layouts: Object,
  next: Object,
  inverted: Object,
  index: number
}

export const rightToLeft = (screenProps: screenProps) => {
  const { current , layouts, next, inverted } = screenProps;
  const { screen } = layouts;
  const { width } = screen;

  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width * -0.3],
        extrapolate: 'clamp',
      }), inverted)
    : 0;

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
  };
}

export const leftToRight = (screenProps: screenProps) => {
  const { current , layouts, next, inverted, index } = screenProps;
  const { screen } = layouts;
  const { width } = screen;

  const translateFocused = multiply(
    current.progress.interpolate({
      inputRange: [ index - 1, index ],
      outputRange: [ -width, 0 ],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const translateUnfocused = next
    ? multiply(
        next.progress.interpolate({
        inputRange: [ index, index + 1 ],
        outputRange: [ 0, width ],
        extrapolate: 'clamp',
      }), inverted)
    : 0;

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
    },
  };
}