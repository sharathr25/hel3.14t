import React from 'react';
import { Text } from 'react-native';
import { styles } from '../../constants/styleConstants';

const ErrorMessage = (props) => {
  const { errorMessage } = props;
  return (
    <Text style={styles.errorMessage}>
      {errorMessage}
    </Text>
  );
}

export default ErrorMessage;