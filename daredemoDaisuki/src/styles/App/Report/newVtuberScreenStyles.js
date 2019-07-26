import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  modalContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: colorTheme[color].areaQuinary,
    opacity: 0.5,
  },
  footerText:{
    fontSize: 12,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
  },
  scrollContainer: {
    padding: "5%",
  },
  contentContainer:{
    flex:1
  },
  picker: {
    height: 40,
    backgroundColor: colorTheme[color].areaSecondary,
  },
  pickerItem: {

  },
});
