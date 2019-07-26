import React from 'react';
import { Text as NBText, List as NBList, ListItem as NBListItem } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles } from '../../../styles/App/Setting/fontScreenStyles.js';
import { changeFont } from '../../../actions/userActions.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  changeFont: (input) => dispatch(changeFont(input)),
});

class FontScreen extends React.Component {
  render() {
    return (
      <NBList>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeFont('normal');
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Normal</NBText>
            <NBText style={fontsStyles('normal').ui}>Normal</NBText>
        </NBListItem>
        <NBListItem style={styles(this.props.user.colorTheme).listItem}  onPress={()=>{
          this.props.changeFont('vivid')
          this.props.navigation.navigate('SplashScreen');
        }}>
            <NBText style={fontsStyles(this.props.user.font).ui}>Vivid</NBText>
            <NBText style={fontsStyles('vivid').ui}>Vivid</NBText>
        </NBListItem>
      </NBList>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FontScreen)
