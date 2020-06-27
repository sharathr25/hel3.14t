
import React from "react";
import { Text } from 'native-base';

const Distance = ({ distance }) => {
  return (
    <Text note>{`${distance ? distance.toFixed(1) : 0} KM Away`}</Text>
  );
};

export default Distance;