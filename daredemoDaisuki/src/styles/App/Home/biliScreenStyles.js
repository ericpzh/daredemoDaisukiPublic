import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'
export const colors = colorTheme;

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  fullscreenContainer:{
    backgroundColor: colorTheme[color].areaQuinary,
    flex: 1,
  },
  fullscreen: {
    width: '100%',
    height: '100%'
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
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginTop: 30,
    width: "100%",
    backgroundColor: colorTheme[color].areaSecondary
  },
  listContainer: {
    width: '100%',
  },
  fab: {
    backgroundColor: colorTheme[color].themeColor
  },

  horizontalListContainer:{
    flexShrink: 1,
    height: 80,
    alignItems: 'stretch',
    borderBottomColor: colorTheme[color].textQuaternary,
    borderBottomWidth: 1,
  },
  horizontalListItem:{
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  horizontalListItemImage:{
    borderWidth: 3.5,
    borderColor: '#FA8072',
    width: 60,
    height: 60,
  },

  listItem:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomWidth: .25,
    backgroundColor: colorTheme[color].areaPrimary,
    borderColor: colorTheme[color].textQuaternary,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  listItemHeader:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  listItemHeaderImageWrapper:{
    flexShrink: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    borderColor: colorTheme[color].textQuaternary,
    shadowColor: colorTheme[color].textPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },
  listItemHeaderImage:{
    flexShrink: 1,
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: "cover",
  },
  listItemHeaderTextWrapper:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  listItemHeaderText:{
    flex: 1,
    color: colorTheme[color].textPrimary,
    fontSize: 17,
    lineHeight: 20,
  },
  listItemHeaderSubText:{
    flex: 1,
    color: colorTheme[color].textSecondary,
  },

  listItemContent:{
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: colorTheme[color].textQuaternary,
    shadowColor: colorTheme[color].textPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },
  listItemContentImage:{
    flex: 1,
    width:'100%',
    height: 180,
    resizeMode: "cover",
  },
  listItemContentVideo:{
    flex: 1,
    width:'100%',
    height: 180,
  },

  listItemFooter:{
    flex: 1,
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"space-between",
  },
  listItemFooterText:{
    flexGrow: 1,
    color: colorTheme[color].textTertiary,
    fontSize: 12
  },
  listItemFooterButton:{
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "flex-end",
  },
  listItemFooterButtonIcon:{
    color: colorTheme[color].textTertiary,
    paddingLeft: 3,
  },
  listItemFooterButtonText:{
    color: colorTheme[color].textTertiary,
    fontSize: 12
  },

  listFooter:{
    flex: 1,
    paddingVertical: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },
});
