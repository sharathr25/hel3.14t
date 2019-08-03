import React from 'react';
import { Input } from 'react-native-elements';
import { styles } from '../constants/styleConstants';

const InputComponent = (props) => {
    return (
      <Input
        placeholder={props.placeholder}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        containerStyle={{ margin: 10 }}
        secureTextEntry={props.secureTextEntry}
        onChangeText={value => props.updateParentState(value)}
        />
    );
}

export default InputComponent;