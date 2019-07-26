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
  tutorialContainer:{
    margin: 3,
    borderRadius:10,
    borderStyle:'dashed',
    borderWidth: 2,
    borderColor: colorTheme[color].textSecondary,
    opacity: 0.5
  },
  tutorialItemHeader:{
    flex:1,
    flexDirection:'row',
    width:"95%",
    alignItems:'center',
    marginVertical: 5,
    marginHorizontal: "2.5%",
    fontSize: 16,
    paddingVertical:10,
    paddingHorizontal: 20,
    borderBottomWidth:3,
    borderColor: colorTheme[color].textSecondary
  },
  tutorialItem:{
    flex:1,
    flexDirection:'row',
    width:"95%",
    alignItems:'center',
    marginVertical: 5,
    marginHorizontal: "2.5%",
    fontSize: 16,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal: 20,
    borderStyle:'dotted',
    borderWidth:3,
    borderColor: colorTheme[color].textSecondary
  },
  tutorialItemContent:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  tutorialItemIcon:{
    marginHorizontal: 5,
  },
  tutorialFooter:{
    backgroundColor: colorTheme[color].areaPrimary,
    position: 'absolute', bottom: 0
  },
  tutorialFooterItem:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginVertical: 5,
    marginHorizontal: "20%",
    fontSize: 16,
    borderRadius:10,
    paddingVertical:20,
    paddingHorizontal: 20,
    borderStyle:'dotted',
    borderWidth: 3,
    borderColor: colorTheme[color].textSecondary
  },
  container: {
    backgroundColor: colorTheme[color].areaPrimary,
    flex: 1,
    width: '100%',
  },
  accordionHeader: {
    flexDirection: "row",
    width: "100%",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor:  colorTheme[color].areaSecondary,
    borderRadius: 5,
  },
  accordionHeaderIcon:{
    fontSize: 20,
    marginLeft: "auto"
  },
  accordionHeaderText:{
    fontSize: 16,
    flex: 1,
    textAlign: "center"
  },
  nbListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItemIcon: {
    paddingHorizontal: 15
  },
  listItemWrapper:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItem:{
    alignSelf: 'stretch',
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
  listItemHeaderImage:{
    width: 50,
    height: 50
  },
  listItemHeaderText:{
    color: colorTheme[color].textPrimary,
    fontSize: 18
  },
  listItemHeaderSubText:{
    color: colorTheme[color].textSecondary,
    fontSize: 15
  },
  listItemButtonIcon:{
    height:20,
    width:20,
  },
  modalList:{
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  fab: {
    backgroundColor: colorTheme[color].themeColor
  },
});
