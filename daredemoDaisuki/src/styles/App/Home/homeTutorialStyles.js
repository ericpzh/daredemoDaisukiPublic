import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = StyleSheet.create({
  tutorialContainer:{
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginBottom: 20
  },
  tutorialItem:{
    flexShrink:1,
    flexDirection:'row',
    alignItems:'center',
    marginVertical: 5,
    fontSize: 16,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal: 10,
    borderStyle:'dotted',
    borderWidth:3,
    borderColor: colorTheme['black'].textSecondary,
  },
  tutorialItemContent:{
    flexShrink:1,
    flexDirection:'row',
    alignItems:'center'
  },
  tutorialItemIcon:{
    marginHorizontal: 5,
  },
})
