import { StyleSheet } from 'react-native';

import { colorTheme } from '../colorTheme.js'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button:{
    marginVertical: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemIcon:{

  },
  content:{
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colorTheme['black'].areaQuinary,
    opacity: 0.9,
  },
});
