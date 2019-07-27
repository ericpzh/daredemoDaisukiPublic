import { StyleSheet } from 'react-native';

import { colorTheme } from '../../colorTheme.js'

import { fonts } from '../../fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
  fullscreenContainer:{
    flex: 1,
    backgroundColor: colorTheme[color].areaQuinary,
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
    justifyContent: 'center',
  },
  listContainer: {
    alignItems: 'stretch'
  },
  fab: {
    backgroundColor: colorTheme[color].themeColor,
  },

  listItem:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomWidth: .25,
    backgroundColor: '#fff',
    borderColor: colorTheme[color].textQuaternary,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  listItemExtendedTweet:{
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f9f9f9',
    borderColor: colorTheme[color].areaSecondary,
    borderRadius: 5,
    borderWidth: .25,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: colorTheme[color].textPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
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
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  listItemHeaderTextWrapper:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  listItemHeaderText:{
    flex: 1,
    color: colorTheme[color].textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  listItemHeaderSubText:{
    flex: 1,
    color: colorTheme[color].textSecondary,
  },

  listItemContent:{
    flex: 1,
    marginTop: 10,
  },
  listItemContentWebViewContainer:{
    overflow:'hidden',
    flex: 1,
    marginTop: 10,
  },
  listItemContentImageContainer:{
    flex: 1,
    width: "100%",
  },
  listItemContentMedia:{
    flex:1,
    marginVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: colorTheme[color].textQuaternary,
    shadowColor: colorTheme[color].textPrimary,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },
  listItemContentImageColBreak:{
    width: 2.5,
  },
  listItemContentImageRowBreak:{
    height: 2.5,
  },
  listItemContentImage:{
    flex: 1,
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  listItemContentImage2:{
    flex: 1,
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  listItemContentImage3:{
    flex: 1,
    width: "100%",
    height: 50,
    resizeMode: "cover",
  },
  listItemContentVideo:{
    flex: 1,
    width: "100%",
    height: 180,
  },
  listItemContentLink:{
    fontSize: 13,
  },
  listItemContentText:{
    flex:1,
    flexDirection:'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 13,
  },

  listItemFooter:{
    flex: 1,
    flexDirection:"row",
    alignItems: 'center',
    justifyContent:"space-between",
  },
  listItemFooterText:{
    color: colorTheme[color].textTertiary,
    fontSize: 12,
  },
  listItemFooterButton:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
    marginTop: 5,
  },
  listItemFooterIcon:{
    paddingLeft: 7,
  },
  listFooter:{
    flex: 1,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
    paddingVertical: 10,
  },
});
