import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
  },
  container: {
    paddingHorizontal: 15,
  },
  wrapper: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  headerIcon:{
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 10,
  },
  smallDivider: {
    marginTop: 10,
  },
  icon: {
    margin: 10,
  },
  apikeys: {
    color: colorTheme[color].textTertiary,
    fontSize: 10,
  },
  modalContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: colorTheme[color].areaQuinary,
    opacity: 0.5,
  },
});
