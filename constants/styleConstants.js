import { StyleSheet } from 'react-native';

export const FLAG_COLOR_ORANGE = '#FF9933';
export const FLAG_COLOR_WHITE = '#FFFFFF';
export const FLAG_COLOR_GREEN = '#138808';
export const FLAG_COLOR_BLUE = '#000080';

export const COLOR_1 = '#ff7e5f';
export const COLOR_2 = '#ff9966';

export const THEME_COLOR = FLAG_COLOR_ORANGE;

export const BLACK = "#000000";

export const INPUT_BORDER_COLOR = FLAG_COLOR_ORANGE;
export const INPUT_TEXT_COLOR = 'black';

export const FONT_FAMILY = 'monospace';
export const FONT_COLOR = 'white';
export const FONT_SIZE_HEADING = 16;
export const FONT_SIZE_SUB_HEADING = 14;
export const FONT_SIZE_TEXT = 12;

export const ERROR_MESSAGE_TEXT_COLOR = 'red';

export const styles = StyleSheet.create({
  inputContainerStyle: {
    borderColor: INPUT_BORDER_COLOR,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingLeft: 5,
  },
  inputStyle: {
    color: INPUT_TEXT_COLOR
  },
  button: {
    backgroundColor: THEME_COLOR,
    width: 100
  },
  errorMessage: {
    color: ERROR_MESSAGE_TEXT_COLOR,
    padding: 5
  }
});
