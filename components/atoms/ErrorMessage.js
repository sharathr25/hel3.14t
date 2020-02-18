import React from 'react';
import { Text } from 'react-native';
import { styles } from '../../constants/styleConstants';

const ErrorMessage = (props) => {
  const { message } = props;
  return (
    <Text style={styles.errorMessage}>
      {message}
    </Text>
  );
}

export default ErrorMessage;