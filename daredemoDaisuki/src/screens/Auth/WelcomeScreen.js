import React from 'react';
import { View, Dimensions } from 'react-native'
import { Text as NBText, List as NBList, ListItem as NBListItem, Button as NBButton } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../../styles/Auth/welcomeScreenStyles.js';
import Carousel from '../../assets/loginBackground.js';

export default class WelcomeScreen extends React.Component {
  render() {
    var {height, width} = Dimensions.get('window');
    return(
      <View style={styles.container} >
        <Carousel width={width}/>
        <View style={styles.content} >
          <NBButton bordered light onPress={() => this.props.navigation.navigate('SignIn')} style={styles.button}>
            <Icon name="md-log-in" color="white" size={20} style={styles.listItemIcon}/>
            <NBText>Sign In</NBText>
          </NBButton>
          <NBButton bordered light onPress={() => this.props.navigation.navigate('SignUp')} style={styles.button}>
            <Icon name="md-open"  color="white" size={20} style={styles.listItemIcon}/>
            <NBText>Sign Up</NBText>
          </NBButton>
        </View>
      </View>
    );
  }
}
