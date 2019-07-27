import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'
export const colors = colorTheme;

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorTheme[color].themeColor,
    paddingTop: 15,
    height: 75
  },
  icon: {
    color:colorTheme[color].textQuinary,
    paddingHorizontal: 15,
  },
  text: {
    alignSelf:'center',
    fontSize: 18.5,
    color: colorTheme[color].textQuinary,
  }
})
