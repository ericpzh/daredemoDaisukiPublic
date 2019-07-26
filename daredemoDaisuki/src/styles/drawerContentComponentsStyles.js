import { StyleSheet } from 'react-native';

import { colorTheme } from './colorTheme.js'

import { fonts } from './fonts.js';
export const fontsStyles = fonts;

export const styles = (color = 'black') => StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    headerContainer: {
        alignItems: 'center',
        width: "100%",
        height: 100,
        paddingTop: 50,
        paddingBottom: 140,
        alignSelf: 'center',
        backgroundColor: colorTheme[color].themeColor,
    },
    headerIcon:{
      color: colorTheme[color].textQuinary,
    },
    headerText: {
        color: colorTheme[color].textQuinary,
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: "100%",
    },
    screenStyleActive:{
      height: 50,
      paddingLeft: 30,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorTheme[color].areaSecondary,
    },
    screenStyle: {
        height: 50,
        paddingLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    screenTextStyle:{
        fontSize: 16,
        marginLeft: 20,
        color: colorTheme[color].themeColor,
    },
    screenIconStyle:{
        fontSize: 25,
        color: colorTheme[color].themeColor,
    },
});
