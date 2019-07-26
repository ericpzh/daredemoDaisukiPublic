import { StyleSheet } from 'react-native';

export const fonts = (font = 'vivid') => {
  switch (font) {
    case 'vivid':
      var headerFont = 'jph';
      var subheaderFont = 'jpsh';
      var headerFontCN = 'sch';
      var subheaderFontCN = 'scsh';
      var textFont = 'jp';
      var textFontCN = 'sc';
      var tagFont = 'jp';
      var linkFont = 'jp';
      var uiFont = 'ui';
      var uiheaderFont = 'uih';
      break;
    case 'normal':
      var headerFont = '';
      var subheaderFont = '';
      var headerFontCN = '';
      var subheaderFontCN = '';
      var textFont = '';
      var textFontCN = '';
      var tagFont = '';
      var linkFont = '';
      var uiFont = '';
      var uiheaderFont = '';
    default:
      var headerFont = '';
      var subheaderFont = '';
      var headerFontCN = '';
      var subheaderFontCN = '';
      var textFont = '';
      var textFontCN = '';
      var tagFont = '';
      var linkFont = '';
      var uiFont = '';
      var uiheaderFont = '';
  }
  return StyleSheet.create({
    link: {
      color: '#0080FF',
      fontFamily: linkFont,
    },
    tag: {
      color: '#0080FF',
      fontFamily: tagFont,
    },
    text: {
      fontFamily: textFont,
    },
    subheader: {
      fontFamily: subheaderFont,
    },
    header: {
      fontFamily: headerFont,
    },
    textcn:{
      fontFamily: textFontCN,
    },
    subheadercn: {
      fontFamily: subheaderFontCN,
    },
    headercn: {
      fontFamily: headerFontCN,
    },
    ui: {
      fontFamily: uiFont,
    },
    uiheader: {
      fontFamily: uiheaderFont,
    }
  });
}
