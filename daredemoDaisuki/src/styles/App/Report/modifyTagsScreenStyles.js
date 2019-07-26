import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    marginHorizontal: 10,
  },
  modalContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: colorTheme[color].areaQuinary,
    opacity: 0.5,
  },
  listItem:{
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomColor: colorTheme[color].areaSecondary,
    borderBottomWidth: 1,
  },
  listItemHeader:{
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemHeaderTextWrapper:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    marginLeft: 10,
  },
  listItemHeaderImage:{
    width: 50,
    height: 50
  },
  listItemHeaderText:{
    color: colorTheme[color].textPrimary,
    fontSize: 17
  },
  listItemHeaderSubText:{
    color: colorTheme[color].textSecondary,
    fontSize: 13
  },
  listItemButtonIcon:{
    height:20,
    width:20,
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
  fab: {
    backgroundColor: colorTheme[color].themeColor,
    marginBottom: 50,
  },
  badgeEdit:{
    backgroundColor: colorTheme[color].themeColor,
    marginTop: 2,
    marginHorizontal: 3,
    opacity: .8,
  },
  badgeTextEdit:{
    color: colorTheme[color].textQuinary,
    fontSize: 14,
  },
  tagsContainer:{
    marginHorizontal: 10,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  scrollContainer:{
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'stretch',
  },
  footerText:{
    fontSize: 12,
  },
});
