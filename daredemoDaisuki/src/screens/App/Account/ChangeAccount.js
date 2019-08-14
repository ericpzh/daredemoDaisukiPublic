import React from 'react';
import { TouchableOpacity, Image, View, Text, ScrollView, Modal } from 'react-native';
import { Icon as NBIcon, Item as NBItem, Input as NBInput } from 'native-base';
import { Permissions } from 'expo';
import Constants from 'expo-constants';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import LoadingComponent from '../../../assets/loading.js';
import { styles, fontsStyles } from '../../../styles/App/Account/changeAccountScreenStyles.js';
import { putImage, putNickname } from '../../../api/express.js';
import { updateProfile } from '../../../api/firebase.js';
import { changeNicknameBegin, changeNicknameSuccess, changeNicknameFailure, changeImageBegin, changeImageSuccess, changeImageFailure } from '../../../actions/userActions.js';

const imageSize = 500;

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
  changeNicknameBegin: () => dispatch(changeNicknameBegin()),
  changeNicknameSuccess: (input) => dispatch(changeNicknameSuccess(input)),
  changeNicknameFailure: () => dispatch(changeNicknameFailure()),
  changeImageBegin: () => dispatch(changeImageBegin()),
  changeImageSuccess: (input) => dispatch(changeImageSuccess(input)),
  changeImageFailure: () => dispatch(changeImageFailure()),
});

class ChangeAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      editNickname: false,
    }
    this.getPermissionAsync = this.getPermissionAsync.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.submitNickname = this.submitNickname.bind(this);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  submitNickname() {
    /*
    Change Nickname
    */
    putNickname(this.props.user.name, this.props.user.password, this.state.nickname, this.props.changeNicknameBegin, this.props.changeNicknameSuccess, this.props.changeNicknameFailure );
    this.setState({  nickname: "", editNickname: false});//reset state
  }

  async getPermissionAsync() {
    /*
    Get IOS Permission
    */
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  async pickImage() {
    /*
    Alter Image
    */
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1], //lock 1:1 ratio
    });
    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{resize: { width: imageSize, height: imageSize }}],//crop to smaller size
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }//save as png
      );
      const response = await fetch(manipResult.uri); //change to blob file
      const file = await response.blob();
      updateProfile(this.props.user.name, this.props.user.password, file, this.props.user.image, putImage, this.props.changeImageBegin, this.props.changeImageSuccess, this.props.changeImageFailure)
    }
  };

  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.user.authLoading}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <ScrollView>
          <View style={styles(this.props.user.colorTheme).profileContainer}>
            {
              this.props.user.image === ""
              ?
              <View style={styles(this.props.user.colorTheme).imageContainer}>
                <TouchableOpacity onPress={this.pickImage} style={styles(this.props.user.colorTheme).badgeIcon}>
                  <Icon name="md-add" size={25}/>
                </TouchableOpacity>
                <Icon name="md-contact" size={125} style={styles(this.props.user.colorTheme).profileIcon}/>
              </View>
              :
              <View style={styles(this.props.user.colorTheme).imageContainer}>
                <TouchableOpacity onPress={this.pickImage} style={styles(this.props.user.colorTheme).badgeImage}>
                  <Icon name="md-create" size={20}/>
                </TouchableOpacity>
                <Image source={{ uri: this.props.user.image }} style={styles(this.props.user.colorTheme).profileImage}/>
              </View>

            }
          </View>
          <View style={styles(this.props.user.colorTheme).nicknameContainer}>
          {
            this.state.editNickname
            ?
            (
              this.state.nickname !== ""
              ?
              <NBItem success>
                <NBInput placeholder="Edit Nickname" autoFocus value={this.state.nickname} style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).nickname]} onChangeText={(value: string)=>{this.setState({nickname:value})}} onSubmitEditing={this.submitNickname}/>
                <TouchableOpacity onPress={this.submitNickname}>
                  <NBIcon name='checkmark-circle' />
                </TouchableOpacity>
              </NBItem>
              :
              <NBItem error>
                <NBInput placeholder="Edit Nickname" autoFocus value={this.state.nickname} style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).nickname]} onChangeText={(value: string)=>{this.setState({nickname:value})}} onSubmitEditing={() => this.setState({editNickname: false})}/>
                <TouchableOpacity onPress={() => this.setState({editNickname: false})}>
                  <NBIcon name='close-circle' />
                </TouchableOpacity>
              </NBItem>
            )
            :
            <View style={styles(this.props.user.colorTheme).nicknameTextContainer}>
              <Text style={[fontsStyles(this.props.user.font).uiheader,styles(this.props.user.colorTheme).nickname]}>
              { this.props.user.nickname === ""? "Add a Nickname" : this.props.user.nickname }
              </Text>
              <TouchableOpacity onPress={() => this.setState({editNickname: true})} style={styles(this.props.user.colorTheme).nicknameIcon}>
                <Icon name="md-create" size={20}/>
              </TouchableOpacity>
            </View>
          }
          </View>
          <View style={styles(this.props.user.colorTheme).nameContainer}>
            <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).name]}> { '@' + this.props.user.name } </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ChangeAccountScreen);
