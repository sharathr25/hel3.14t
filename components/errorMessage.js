import React from 'react';
import { Text } from 'react-native';

const ErrorMessage = (props) => {
  const { errorMessage } = props;
  return (
    <Text style={styles.errorMessage}>
      {errorMessage}
    </Text>
  );
}

export default ErrorMessage;