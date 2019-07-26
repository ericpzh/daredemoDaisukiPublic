import React from 'react';
import { Text as NBText, List as NBList, ListItem as NBListItem } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../../styles/App/Setting/colorScreenStyles.js';
import { changeColor } from '../../../actions/userActions.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  changeColor: (color) => dispatch(changeColor(color)),
});

class ColorScreen extends React.Component {
  render() {
    return (
      <NBList>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeColor('black');
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Black</NBText>
            <Icon name="md-square" size={20} style={styles(this.props.user.colorTheme).black}/>
        </NBListItem>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeColor('purple')
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Purple</NBText>
            <Icon name="md-square" size={20} style={styles(this.props.user.colorTheme).purple}/>
        </NBListItem>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeColor('red')
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Red</NBText>
            <Icon name="md-square" size={20} style={styles(this.props.user.colorTheme).red}/>
        </NBListItem>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeColor('blue')
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Blue</NBText>
            <Icon name="md-square" size={20} style={styles(this.props.user.colorTheme).blue}/>
        </NBListItem>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeColor('green')
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Green</NBText>
            <Icon name="md-square" size={20} style={styles(this.props.user.colorTheme).green}/>
        </NBListItem>
      </NBList>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ColorScreen)
