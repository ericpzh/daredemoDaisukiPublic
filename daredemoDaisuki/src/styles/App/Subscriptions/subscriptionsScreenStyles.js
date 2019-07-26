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
  container: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
  },
  headerIcon:{
    paddingHorizontal: 30,
  },
  listContainer: {
    width: "100%",
  },
  fab: {
    backgroundColor: colorTheme[color].themeColorSecondary,
  },
  listItem:{
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colorTheme[color].textQuaternary,
    borderBottomWidth: 1,
  },
  listItemHeader:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemHeaderTextWrapper:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    marginLeft: 10,
  },
  listItemContent:{
    marginTop: 10,
  },
  footerButton:{
    backgroundColor: colorTheme[color].themeColor
  },
  footerText:{
    color: colorTheme[color].textQuinary,
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
  listItemContentImage:{
    marginTop: 10,
    width: "100%",
    height: 150,
  },
  listItemFooterText:{
    color: colorTheme[color].textTertiary,
    fontSize: 10
  },
  listFooter:{
    paddingVertical: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },
  listItemButtonIcon:{
    height:20,
    width:20,
    color: colorTheme['red'].themeColor,
  },
});
