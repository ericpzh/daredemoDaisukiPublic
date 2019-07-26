import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  black: {
    color:colorTheme['black'].themeColor
  },
  purple: {
    color:colorTheme['purple'].themeColor
  },
  red:{
    color:colorTheme['red'].themeColor
  },
  blue:{
    color:colorTheme['blue'].themeColor
  },
  green:{
    color:colorTheme['green'].themeColor
  }
});
