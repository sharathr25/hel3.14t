// @flow
import React from 'react';
import { Text } from 'react-native';
import { RED } from '../../styles/colors';

const ErrorMessage = (props: { message : string }) => {
  const { message } = props;
  return (
    <Text style={{ color: RED, padding: 5 }}>
      {message}
    </Text>
  );
}

export default ErrorMessage;