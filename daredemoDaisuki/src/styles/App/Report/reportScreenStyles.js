import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'
export const themeColor = (color) => colorTheme[color].themeColor;

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  button:{
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginVertical: 5,
    borderColor: colorTheme[color].themeColor,
  },
  placeholder:{
    backgroundColor: colorTheme[color].themeColor,
    opacity:0.5,
  },
  content: {
    flexGrow: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  text: {
    color: colorTheme[color].themeColor,
  },
});
