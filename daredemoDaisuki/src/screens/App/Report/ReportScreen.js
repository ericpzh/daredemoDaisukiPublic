import React from 'react';
import { Header } from 'react-navigation';
import { View, Dimensions, Alert } from 'react-native';
import {  Button as NBButton, Text as NBText } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles, themeColor } from '../../../styles/App/Report/reportScreenStyles.js';
import Carousel from '../../../assets/loginBackground.js';
import { setPrevScreen } from '../../../actions/globalActions.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class ReportScreen extends React.Component {
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("ReportScreen");
      }
    );
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles(this.props.user.colorTheme).container}>
          <View style={[styles(this.props.user.colorTheme).placeholder,{ height: 5*(height-Header.HEIGHT)/10 }]} >
            <Carousel width={width} opacity={0.5}/>
          </View>

          <View style={styles(this.props.user.colorTheme).content} >
            <NBButton dark bordered onPress={()=>this.props.navigation.navigate("ModifyTagsScreen")} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-pricetags" color={themeColor(this.props.user.colorTheme)} size={20} style={styles.listItemIcon}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Modify Vtuber's Tags</NBText>
            </NBButton>
            <NBButton dark bordered  onPress={()=>this.props.navigation.navigate("ModifyVtuberScreen")} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-build" color={themeColor(this.props.user.colorTheme)} size={20} style={styles.listItemIcon}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Modify Vtuber's Info</NBText>
            </NBButton>
            <NBButton dark bordered onPress={()=>this.props.navigation.navigate("NewVtuberScreen")} style={styles(this.props.user.colorTheme).button}>
              <Icon name="md-person-add" color={themeColor(this.props.user.colorTheme)} size={20} style={styles.listItemIcon}/>
              <NBText style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).text]}>Suggest New Vtuber</NBText>
            </NBButton>
          </View>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ReportScreen);
