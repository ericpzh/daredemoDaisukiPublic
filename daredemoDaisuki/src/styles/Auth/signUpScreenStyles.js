import { StyleSheet } from 'react-native';

import { colorTheme } from '../colorTheme.js'

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollView:{
  },
  divider: {
    marginTop: 20,
  },
  icon: {
    margin: 5,
  },
  input:{
    color: colorTheme['black'].textPrimary,
  },
  textButton:{
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textButtonText:{
    fontWeight: 'bold',
    color: '#2196F3',
  },
  placeholder:{
    backgroundColor: colorTheme['black'].areaQuinary,
  },
  content: {
    backgroundColor: colorTheme['black'].areaPrimary,
    padding: 30,
    justifyContent: 'space-evenly',
  }
});
