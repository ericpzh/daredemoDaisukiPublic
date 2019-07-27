import { StyleSheet } from 'react-native';

import { colorTheme } from '../colorTheme.js'
export const themeColor = (color) => colorTheme[color].themeColor;

import { fonts } from '../fonts.js';
export const fontsStyles = fonts;

import { styles as youtubeScreenStyles } from './Home/youtubeScreenStyles.js';
export const youtubeStyles = youtubeScreenStyles;

import { styles as biliScreenStyles } from './Home/biliScreenStyles.js';
export const biliStyles =  biliScreenStyles;

import { styles as twitterScreenStyles } from './Home/twitterScreenStyles.js';
export const twitterStyles = twitterScreenStyles;

export const styles = (color = 'black') => StyleSheet.create({
  fullscreenContainer:{
    backgroundColor: colorTheme[color].areaQuinary,
    flex: 1,
  },
  modalContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: colorTheme[color].areaQuinary,
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs:{
    backgroundColor: colorTheme[color].areaSecondary,
  },
  tab:{
    backgroundColor: colorTheme[color].areaSecondary,
  },
  tabActive:{
    backgroundColor: '#f4f4f4',
  },
  tags:{
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  badge:{
    backgroundColor: colorTheme[color].themeColor,
    marginTop: 1,
    marginHorizontal: 2,
    opacity: .8,
  },
  badgeText:{
    color: colorTheme[color].textQuinary,
    fontSize: 12,
  },
  tabText: {
    paddingLeft: 10,
  },
  listItem:{
    paddingTop: 15,
    paddingBottom: 15,
  },
  listItemWrapper:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItemButton: {
    color: colorTheme[color].areaQuinary,
    height: 30,
    width: 30,
  },
  listItemButtonIcon: {
    height:20,
    width:20,
  },
  listFooter:{
    paddingVertical: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },

  buttonContainerYoutube: {
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonYoutube:{
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextYoutube:{
    color: '#2554C7',
    fontSize: 20,
  },
});
