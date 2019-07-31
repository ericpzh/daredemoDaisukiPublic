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
  profileContainer:{
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
    backgroundColor: colorTheme[color].areaPrimary,
  },
  imageContainer:{
    flex: 1,
  },
  profileImage:{
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    zIndex: 0,
  },
  profileIcon:{
    color: colorTheme[color].themeColor,
    zIndex: 0,
  },
  badgeIcon: {
    backgroundColor: colorTheme[color].areaSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    color: colorTheme[color].themeColor,
    position: 'absolute',
    bottom: 20,
    right: 0,
    zIndex: 1,
  },
  badgeImage: {
    backgroundColor: colorTheme[color].areaSecondary,
    paddingHorizontal: 12.5,
    paddingVertical: 7.5,
    borderRadius: 50,
    color: colorTheme[color].themeColor,
    position: 'absolute',
    bottom: 10,
    right: 0,
    zIndex: 1,
  },

  nicknameContainer:{
    flex: 1,
    alignItems: 'center',
    width: '70%',
    marginHorizontal: '15%',
    marginTop: '5%',
    marginBottom: '5%',
  },
  nickname:{
    color: colorTheme[color].textPrimary,
    fontSize: 20,
  },
  nicknameTextContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nicknameIcon:{
    marginHorizontal: 5,
  },

  nameContainer:{
    flex: 1,
    alignItems: 'center'
  },
  name:{
    color: colorTheme[color].textSecondary,
    fontSize: 18,
  },
});
