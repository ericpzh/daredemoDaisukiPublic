import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles, fontsStyles }from '../../../styles/App/Home/homeTutorialStyles.js';

export default class Tutorial extends React.Component {
  render() {
    return (
      <View style={styles.tutorialContainer}>
        <View style={[{justifyContent:'space-between', width:'90%'},styles.tutorialItem]}>
          <View style={[{justifyContent:'flex-start'},styles.tutorialItemContent]}>
            <Icon name="md-arrow-round-up" size={16} style={styles.tutorialItemIcon}/>
            <Text style={fontsStyles(this.props.user.font).ui}>Menu</Text>
          </View>
          <View style={[{justifyContent:'flex-end'},styles.tutorialItemContent]}>
            <Text style={fontsStyles(this.props.user.font).ui}>Subscribe to a Vtuber</Text>
            <Icon name="md-arrow-round-up" size={16} style={styles.tutorialItemIcon}/>
          </View>
        </View>
        <View style={[{justifyContent:'center'},styles.tutorialItem]}>
          <View style={[{justifyContent:'center'},styles.tutorialItemContent]}>
            <Text style={fontsStyles(this.props.user.font).ui}>Filter</Text>
            <Icon name="md-arrow-round-forward" size={16} style={styles.tutorialItemIcon}/>
          </View>
        </View>
      </View>
    );
  }
}
