import React from "react";
import { getTimeDiffrence } from '../../utils/index';
import { Text } from 'native-base';

const Time = ({ time }) => {
  const timeDiffrence = getTimeDiffrence(time) === " ago" ? "just now" : getTimeDiffrence(time)
  return (
    <Text note>{timeDiffrence}</Text>
  );
};

export default Time;