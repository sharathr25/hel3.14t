import { StyleSheet } from 'react-native';

export const THEME_COLOR = '#dd4b39';
export const FONT_FAMILY = 'monospace';
export const FONT_COLOR = 'white';
export const FONT_SIZE_HEADING = 16;
export const FONT_SIZE_SUB_HEADING = 14;
export const FONT_SIZE_TEXT = 12;

export const styles = StyleSheet.create({
  input: {
    borderColor: THEME_COLOR,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingLeft: 5
  },
  button: {
    backgroundColor: THEME_COLOR,
    width: 100
  },
  errorMessage: {
    color: 'red'
  }
});
