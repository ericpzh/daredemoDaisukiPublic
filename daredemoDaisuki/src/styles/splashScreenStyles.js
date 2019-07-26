import { StyleSheet } from 'react-native';

import { colorTheme } from './colorTheme.js'

export const styles = (color = 'black') => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  }
})
