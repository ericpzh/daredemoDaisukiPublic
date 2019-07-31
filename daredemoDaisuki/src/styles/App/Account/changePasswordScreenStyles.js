import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollView:{
  },
  icon: {
    margin: 5,
  },
  input:{
    color: colorTheme[color].textPrimary,
  },
  textButton:{
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  placeholder:{
    backgroundColor: colorTheme[color].themeColor,
    opacity:0.5,
  },
  content: {
    backgroundColor: colorTheme[color].areaPrimary,
    padding: 30,
    justifyContent: 'space-evenly',
  }
});
