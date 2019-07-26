import { StyleSheet } from 'react-native';

import { colorTheme } from '../colorTheme.js'

import { fonts } from '../fonts.js';
export const fontsStyles = fonts;

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
  fullscreenContainerYoutube:{
    backgroundColor: colorTheme[color].areaQuinary,
    flex: 1,
  },
  containerYoutube: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainerYoutube: {
    marginTop: 30,
    width: "100%",
    backgroundColor: colorTheme[color].areaSecondary
  },
  listContainerYoutube: {
    alignItems: 'stretch'
  },
  listItemYoutube:{
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomColor: colorTheme[color].areaSecondary,
    borderBottomWidth: 1,
  },
  listItemHeaderYoutube:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemHeaderTextWrapperYoutube:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    marginLeft: 10,
  },
  listItemContentYoutube:{
    flex: 1,
    marginTop: 5,
    overflow: 'hidden',
  },
  listItemFooterYoutube:{
    flex: 1,
    marginTop: 10,
    flexDirection:"row",
    alignItems: 'flex-end',
    justifyContent:"space-between",
  },
  listItemHeaderImageYoutube:{
    width: 50,
    height: 50
  },
  listItemHeaderTextYoutube:{
    color: colorTheme[color].textPrimary,
    fontSize: 15
  },
  listItemHeaderSubTextYoutube:{
    color: colorTheme[color].textSecondary,
    fontSize: 12
  },
  listItemContentImageYoutube:{
    marginTop: 10,
  },
  listItemFooterTextYoutube:{
    color: colorTheme[color].textTertiary,
    fontSize: 12
  },
  listItemFooterButtonYoutube:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  listItemFooterIconYoutube:{
    paddingLeft: 7,
  },
  listFooterYoutube:{
    flex: 1,
    paddingVertical: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },
  listItemContentVideoYoutube:{
    marginTop: 10,
  },

  fullscreenContainerBili:{
    backgroundColor: colorTheme[color].areaQuinary,
    flex: 1,
  },
  containerBili: {
    flex: 1,
    backgroundColor: colorTheme[color].areaPrimary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerContainerBili: {
    marginTop: 30,
    width: "100%",
    backgroundColor: colorTheme[color].areaSecondary
  },
  listContainerBili: {
    flex: 1,
    alignItems: 'stretch'
  },
  listItemBili:{
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomColor: colorTheme[color].areaSecondary,
    borderBottomWidth: 1,
  },
  listItemHeaderBili:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemHeaderTextWrapperBili:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    marginLeft: 10,
  },
  listItemContentBili:{
    flex: 1,
    marginTop: 5,
    overflow: 'hidden',
  },
  listItemFooterBili:{
    flex: 1,
    marginTop: 10,
    flexDirection:"row",
    alignItems: 'flex-end',
    justifyContent:"space-between",
  },
  listItemHeaderImageBili:{
    width: 50,
    height: 50
  },
  listItemHeaderTextBili:{
    color: colorTheme[color].textPrimary,
    fontSize: 15
  },
  listItemHeaderSubTextBili:{
    color: colorTheme[color].textSecondary,
    fontSize: 12
  },
  listItemContentImageBili:{
    marginTop: 10,
  },
  listItemFooterTextBili:{
    color: colorTheme[color].textTertiary,
    fontSize: 12
  },
  listItemFooterButtonBili:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  listItemFooterIconBili:{
    paddingLeft: 7,
  },
  listFooterBili:{
    flex: 1,
    paddingVertical: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },
  listItemContentVideoBili:{
    marginTop: 10,
  },


  headerContainerTwitter: {
    marginTop: 30,
    width: "100%",
    backgroundColor: colorTheme[color].areaSecondary,
  },
  listContainerTwitter: {
    alignItems: 'stretch'
  },
  listItemTwitter:{
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderColor: colorTheme[color].areaSecondary,
    borderRadius: 5,
    borderWidth: .25,
  },
  listItemContentTextTwitter:{
    flex:1,
    flexDirection:'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  listItemContentMediaTwitter:{
    flex:1,
    flexDirection:'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingBottom: 10,
  },
  listItemHeaderTwitter:{
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 5,
  },
  listItemHeaderTextWrapperTwitter:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    marginLeft: 10,
    flex: 1,
  },
  listItemContentTwitter:{
    flex: 1,
  },
  listItemFooterTwitter:{
    flex: 1,
    flexDirection:"row",
    alignItems: 'flex-end',
    justifyContent:"space-between",
    marginTop: 5,
  },
  listItemHeaderImageTwitter:{
    width: 50,
    height: 50
  },
  listItemHeaderTextTwitter:{
    color: colorTheme[color].textPrimary,
    fontSize: 15
  },
  listItemHeaderSubTextTwitter:{
    color: colorTheme[color].textSecondary,
    fontSize: 12
  },
  listItemContentImageContainerTwitter:{
    flex: 1,
  },
  listItemContentWebViewContainerTwitter:{
    overflow:'hidden',
    flex: 1
  },
  listItemContentImageTwitter:{
    flex: 1,
    width: "100%",
    height: 200,
    paddingTop: 10,
    paddingBottom: 10,
  },
  listItemFooterTextTwitter:{
    color: colorTheme[color].textTertiary,
    fontSize: 12
  },
  listItemFooterButtonTwitter:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  listItemFooterIconTwitter:{
    paddingLeft: 7,
  },
  listFooterTwitter:{
    flex: 1,
    paddingBottom: 10,
    width: "100%",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    color: colorTheme[color].textQuaternary,
  },
});
