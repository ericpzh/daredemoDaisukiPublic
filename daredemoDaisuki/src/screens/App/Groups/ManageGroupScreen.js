import React from 'react';
import {NavigationEvents} from 'react-navigation';
import { Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Icon as NBIcon, Button as NBButton, Text as NBText, List as NBList, ListItem as NBListItem, Left as NBLeft, Body as NBBody, Thumbnail as NBThumbnail, CheckBox as NBCheckBox, Footer as NBFooter, FooterTab as NBFooterTab, Content as NBContent, Item as NBItem, Input as NBInput, SwipeRow as NBSwipeRow, Fab as NBFab } from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { styles, fontsStyles } from '../../../styles/App/Groups/manageGroupScreenStyles.js';
import { init } from '../../../actions/userActions.js';
import altImg from '../../../assets/altImg.jpg';
import { putGroups } from '../../../api/express.js';
import { putGroupsBegin, putGroupsSuccess, putGroupsFailure, changeSeletedGroup, toggleEditingGroupName, manageGroupInit } from '../../../actions/userActions.js';
import ShakingComponent from '../../../assets/shaking.js';
import { setPrevScreen } from '../../../actions/globalActions.js';
import  LoadingComponent  from '../../../assets/loading.js';

//TODO: ADD loading for every call to API
class AddToGroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox: {},
    }
    this.buildList = this.buildList.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }
  toggleCheckbox(vtuber){
    /*
    Handle Checkbox Changes
    */
     var checkbox = this.state.checkbox;
     if (checkbox[vtuber]){
       checkbox[vtuber] = !checkbox[vtuber]; //flip check
     }else{
       checkbox[vtuber] = true; //append to checkbox dict
     }
     this.setState({checkbox:checkbox});
   }
  buildList(){
    /*
    build the list for modal
    */
    var arr = [];
    if (this.props.user.selectedGroup !== ""){//if group valid
      this.props.user.subscriptions.forEach((vtuber)=>{//for each vtuber in subscriptions
        if(!this.props.user.groups.filter((group)=>{
          return group.name === this.props.user.selectedGroup;
        })[0].vtubers.includes(vtuber)){ //if not seleted group include vtuber
          arr.push((
            <NBListItem avatar key={vtuber} onPress={() => {this.toggleCheckbox(vtuber);}}>
              <NBLeft>
                <NBThumbnail source={this.props.vtuber&&this.props.vtuber.vtubersImage&&this.props.vtuber.vtubersImage[vtuber]?{ uri: this.props.vtuber.vtubersImage[vtuber] }:altImg} />
              </NBLeft>
              <NBBody style={styles(this.props.user.colorTheme).listItemWrapper}>
                <View>
                  <NBText style={fontsStyles(this.props.user.font).header}>{ this.props.vtuber&&this.props.vtuber.vtubersDict&&this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].name:vtuber }</NBText>
                  <NBText note style={fontsStyles(this.props.user.font).subheader}>{ vtuber }</NBText>
                </View>
                <View style={styles(this.props.user.colorTheme).listItemButton}>
                  <NBCheckBox checked={this.state.checkbox[vtuber]} style={styles(this.props.user.colorTheme).listItemButtonIcon}  onPress={() => {this.toggleCheckbox(vtuber);}}/>
                </View>
              </NBBody>
            </NBListItem>
          ))
        }
      })
    }
    return arr;
  }
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          this.props.toggleModal();
        }}>
        <NBContent>
          <NBList style={styles(this.props.user.colorTheme).modalList}>
            {this.buildList()}
          </NBList>
        </NBContent>
        <NBFooter>
          <NBFooterTab>
            <NBButton full light onPress={()=>{
              this.props.toggleModal();//close modal
              this.setState({checkbox: {}});//clean up checkbox
            }}>
              <NBText style={fontsStyles(this.props.user.font).ui}> Cancel </NBText>
            </NBButton>
          </NBFooterTab>
          <NBFooterTab>
            <NBButton full success onPress={()=>{
              var groups = this.props.user.groups;
              groups.map((group)=>{ //for each group
                if(group.name === this.props.user.selectedGroup){//located group
                  Object.keys(this.state.checkbox).forEach((key)=>{//for each checkbox
                    if (this.state.checkbox[key]) { //if checked
                      group.vtubers.push(key); //push into groups
                    }
                  })
                  return group;
                }else{
                  return group;
                }
              });
              this.props.putGroup(groups);//put group
              this.props.toggleModal();//close modal
              this.setState({checkbox: {}});//clean up checkbox
            }}>
              <NBText style={[fontsStyles(this.props.user.font).ui,{color:'black'}]}> Confirm </NBText>
            </NBButton>
          </NBFooterTab>
        </NBFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, vtuber } = state
  return { user, vtuber }
};

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(init()),
  putGroupsBegin: () => dispatch(putGroupsBegin()),
  putGroupsSuccess: (groups) => dispatch(putGroupsSuccess(groups)),
  putGroupsFailure: () => dispatch(putGroupsFailure()),
  changeSeletedGroup: (selectedGroup) => dispatch(changeSeletedGroup(selectedGroup)),
  toggleEditingGroupName: () => dispatch(toggleEditingGroupName()),
  manageGroupInit: () => dispatch(manageGroupInit()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class ManageGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      reorderGroups: [],
      addToGroupModalVisible: false,
      groupNameInput: "",
      manageGroupEditingMode: false,
    }
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.putGroup = this.putGroup.bind(this);
    this.toggleAddToGroupModal = this.toggleAddToGroupModal.bind(this);
  }
  putGroup (groups) {
    /*
    Call putGroupsSuccess in smart component
    */
    putGroups(this.props.user.name, this.props.user.password, groups, this.props.putGroupsBegin, this.props.putGroupsSuccess, this.props.putGroupsFailure);
  }
  renderHeader(item) {
    /*
    Return Header of each group for Accordion
    */
    if (this.props.user.editingGroupName && this.props.user.selectedGroup === item.name) { //if editing name && editing selected group's name
      var valid = this.state.groupNameInput!==""; //not empty
      this.props.user.groups.forEach((group)=>{
        if(group.name === this.state.groupNameInput){ //not same name as existing gruop
          valid = false;
        }
      });
      if (valid) {//if valid
        var submit = ()=>{
          var groups = this.props.user.groups.map((group)=>{ //foreach group
            if (group.name === this.props.user.selectedGroup ){ //if is seleted group
              return {
                name: this.state.groupNameInput, //change name to input
                vtubers: group.vtubers,
              };
            }else{
              return group;
            }
          });
          this.putGroup(groups);//putgroup
          this.props.changeSeletedGroup("");
          this.props.toggleEditingGroupName();
          this.setState({groupNameInput:""});
        };
        return (
          <NBItem success>
            <NBInput placeholder='Group Name' autoFocus onSubmitEditing={submit} value={this.state.groupNameInput} style={fontsStyles(this.props.user.font).ui} onChangeText={value => this.setState({groupNameInput: value})}/>
            <TouchableOpacity onPress={submit}>
              <NBIcon name='checkmark-circle' />
            </TouchableOpacity>
          </NBItem>
        );
      }else {
        var submit = ()=>{
          this.props.toggleEditingGroupName();
          this.setState({groupNameInput:""});
        };
        return (
          <NBItem error>
              <NBInput placeholder='Group Name' autoFocus onSubmitEditing={submit} value={this.state.groupNameInput} style={fontsStyles(this.props.user.font).ui} onChangeText={value => this.setState({groupNameInput:value})}/>
              <TouchableOpacity onPress={submit}>
                <NBIcon name='close-circle' />
              </TouchableOpacity>
          </NBItem>
        );
      }
    }else{//normal header
      return (
          <NBSwipeRow
            leftOpenValue={50}
            rightOpenValue={-50}
            left={
              <NBButton full light onPress={() => {
                this.props.changeSeletedGroup(item.name); //current group
                this.props.toggleEditingGroupName(); //editing name
              }}>
                <Icon size={25} name="md-create"/>
              </NBButton>
            }
            body={
              <TouchableOpacity
                onLongPress={()=>{
                  this.setState({reorderGroups:this.props.user.groups, manageGroupEditingMode: true});
                }}
                onPress={()=>{
                  var activeSections = this.state.activeSections;
                  var index = this.props.user.groups.indexOf(item); //index of this item
                  if(activeSections.includes(index)){// if already open
                    activeSections = activeSections.filter((item)=>item!==index);//remove idx
                  }else{
                    activeSections = [...activeSections,index];//append idx
                  }
                  this.setState({activeSections:activeSections});
                }}
                style={styles(this.props.user.colorTheme).accordionHeader}
              >
                <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).accordionHeaderText]}>{item.name}</Text>
                <Icon name={this.state.activeSections.includes(this.props.user.groups.indexOf(item))?"md-arrow-dropup-circle":"md-arrow-dropdown-circle"} size={20}/>
              </TouchableOpacity>
            }
            right={
              <NBButton full danger onPress={() => {//delete
                var groups = this.props.user.groups.filter((group)=>{ //foreach group
                  return group.name !== item.name; //filter out the selected deleted group
                });
                this.putGroup(groups);//putgroup
              }}>
                <Icon size={25} name="md-trash" style={{color:'white'}}/>
              </NBButton>
            }
          />
      )
    }
  }
  renderContent(item) {
    /*
    Returns Contents of each group for Accordion
    */
    var arr = [(
      <NBListItem style={styles(this.props.user.colorTheme).nbListItem} key={item.name} onPress={()=>{
        this.props.changeSeletedGroup(item.name);
        this.toggleAddToGroupModal();
      }}>
          <Icon name="md-add" size={20} style={styles(this.props.user.colorTheme).listItemIcon}/>
          <NBText style={fontsStyles(this.props.user.font).ui}>Add New Vtubers</NBText>
      </NBListItem>
    )];
    item.vtubers.forEach((vtuber)=>{
      arr.push((
          <NBSwipeRow
            key = {vtuber}
            rightOpenValue={-75}
            body={
              <View style={styles(this.props.user.colorTheme).listItem}>
                <View style={styles(this.props.user.colorTheme).listItemHeader}>
                  <NBThumbnail
                    style={styles(this.props.user.colorTheme).listItemHeaderImage}
                    source={this.props.vtuber&&this.props.vtuber.vtubersImage&&this.props.vtuber.vtubersImage[vtuber]?{uri: this.props.vtuber.vtubersImage[vtuber]}:altImg }
                  />
                  <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}>
                    <Text style={[fontsStyles(this.props.user.font).header,styles(this.props.user.colorTheme).listItemHeaderText]}>{this.props.vtuber&&this.props.vtuber.vtubersDict&&this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].name:vtuber}</Text>
                    <Text style={[fontsStyles(this.props.user.font).subheader,styles(this.props.user.colorTheme).listItemHeaderSubText]}>{vtuber}</Text>
                  </View>
                </View>
              </View>
            }
            right={
              <NBButton full danger onPress={()=>{
                putGroups(this.props.user.name, this.props.user.password,
                  this.props.user.groups.map((group)=>{
                    if(group.name && group.name === item.name){//if groups is the same name
                      group.vtubers = group.vtubers.filter((vtb)=>{
                        return vtb !== vtuber;
                      })//filter out the removed vtuber, not delete group if empty
                    }
                    return group;
                  })
                  ,this.props.putGroupsBegin, this.props.putGroupsSuccess, this.props.putGroupsFailure);
              }}>
                <Icon size={25} name="md-trash" style={{color:'white'}}/>
              </NBButton>
            }
          />
      ))
    });
    return arr;
  }
  renderItem({ item, index, move, moveEnd, isActive }){
    /*
    Component for draggable list when editing
    */
    var component =
    (<TouchableOpacity  style={styles(this.props.user.colorTheme).listHeader} onLongPress={move} onPressOut={moveEnd}>
      <Icon size={20} name="md-reorder"/>
      <Text style={[fontsStyles(this.props.user.font).ui,styles(this.props.user.colorTheme).accordionHeaderText]}>{item.name}</Text>
    </TouchableOpacity>)
    return(
      <ShakingComponent component={component} moveRangeX={1} moveRangeY={1} duration={200}/>
    );
  }
  toggleAddToGroupModal(){
    /*
    toggle modal open
    */
    this.setState({
      activeSections:[],
      addToGroupModalVisible: !this.state.addToGroupModalVisible,
    });
  }
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("ManageGroupScreen");
      }
    );
    this.props.manageGroupInit();
  }
  render() {
    return (
      <View style={styles(this.props.user.colorTheme).container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.user.groupsLoading}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <AddToGroupModal modalVisible={this.state.addToGroupModalVisible} putGroup={this.putGroup} user={this.props.user} vtuber={this.props.vtuber} toggleModal={this.toggleAddToGroupModal}/>
        <NavigationEvents onDidFocus={() =>{
          this.setState({manageGroupEditingMode: false});
        }}/>
        <ScrollView>
          {
            this.state.manageGroupEditingMode
            ?
            <DraggableFlatList data={this.state.reorderGroups} renderItem={this.renderItem} keyExtractor={(item, index) => {return item.name}} scrollPercent={5} onMoveEnd={({ data }) => {this.setState({reorderGroups:data})}}/>
            :
            <View>
              <Accordion activeSections={this.state.activeSections} sections={this.props.user.groups} renderContent={(item)=><ScrollView>{this.renderContent(item)}</ScrollView>} renderHeader={this.renderHeader} onChange={(activeSections)=>this.setState({activeSections:activeSections})}/>
              {
                (this.props.user.groups.length === 0 || (this.props.user.groups.length === 1 && this.props.user.groups[0].vtubers.length < 2))&&
                (
                  <View style={styles(this.props.user.colorTheme).tutorialContainer}>
                    <View style={[{justifyContent:'center'},styles(this.props.user.colorTheme).tutorialItemHeader]}>
                      <Text style={fontsStyles(this.props.user.font).ui}> Group A: </Text>
                    </View>
                    <View style={[{justifyContent:'space-between'},styles(this.props.user.colorTheme).tutorialItem]}>
                      <View style={[{justifyContent:'flex-start'},styles(this.props.user.colorTheme).tutorialItemContent]}>
                        <Icon name="md-arrow-round-forward" size={16} style={styles(this.props.user.colorTheme).tutorialItemIcon}/>
                        <Text style={fontsStyles(this.props.user.font).ui}> Swipe to Edit Name</Text>
                      </View>
                      <View style={[{justifyContent:'flex-end'},styles(this.props.user.colorTheme).tutorialItemContent]}>
                        <Text style={fontsStyles(this.props.user.font).ui}> Swipe to Delete </Text>
                        <Icon name="md-arrow-round-back" size={16} style={styles(this.props.user.colorTheme).tutorialItemIcon}/>
                      </View>
                    </View>
                    <View style={[{justifyContent:'space-between'},styles(this.props.user.colorTheme).tutorialItem]}>
                      <View style={[{justifyContent:'flex-start'},styles(this.props.user.colorTheme).tutorialItemContent]}>
                        <Icon name="md-radio-button-on" size={16} style={styles(this.props.user.colorTheme).tutorialItemIcon}/>
                        <Text style={fontsStyles(this.props.user.font).ui}> Hold to Reorder</Text>
                      </View>
                      <View style={[{justifyContent:'flex-end'},styles(this.props.user.colorTheme).tutorialItemContent]}>
                        <Text style={fontsStyles(this.props.user.font).ui}> Tap to Expand</Text>
                        <Icon name="md-radio-button-off" size={16} style={styles(this.props.user.colorTheme).tutorialItemIcon}/>
                      </View>
                    </View>
                    <View style={[{justifyContent:'center'},styles(this.props.user.colorTheme).tutorialItemHeader]}>
                      <Text style={fontsStyles(this.props.user.font).ui}> Vtuber in Group A: </Text>
                    </View>
                    <View style={[{justifyContent:'flex-end'},styles(this.props.user.colorTheme).tutorialItem]}>
                      <Text style={fontsStyles(this.props.user.font).ui}> Remove Vtuber From Group </Text>
                      <Icon name="md-arrow-round-back" size={16} style={styles(this.props.user.colorTheme).tutorialItemIcon}/>
                    </View>
                  </View>
                )
              }
            </View>
          }
        </ScrollView>
        <NBFab
          active={false}
          style={styles(this.props.user.colorTheme).fab}
          position="bottomRight"
          onPress={()=>{
            if(this.state.manageGroupEditingMode){//if editing mode
              this.putGroup(this.state.reorderGroups);
              this.setState({manageGroupEditingMode : false});
            }else{
              var count = this.props.user.groups?this.props.user.groups.length:0;
              this.putGroup([...this.props.user.groups,{
                name: "Group " + (count+1).toString(),
                vtubers: [],
              }]);//append a group
            }
          }}>
          <Icon name={this.state.manageGroupEditingMode?"md-checkmark":"md-add"} />
        </NBFab>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ManageGroupScreen)
