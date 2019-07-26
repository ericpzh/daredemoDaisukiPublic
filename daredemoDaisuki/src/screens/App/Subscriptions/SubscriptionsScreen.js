import React from 'react';
import { View, ListView, TouchableOpacity, FlatList, Modal, Text } from 'react-native';
import { Content as NBContent, Text as NBText, Button as NBButton, Footer as NBFooter, FooterTab as NBFooterTab, ListItem as NBListItem, Left as NBLeft, Body as NBBody, Thumbnail as NBThumbnail, ActionSheet as NBActionSheet, Fab as NBFab, Toast as NBToast, Spinner as NBSpinner } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { colorTheme } from '../../../styles/colorTheme.js';
import { styles, fontsStyles } from '../../../styles/App/Subscriptions/subscriptionsScreenStyles.js';
import { init, filterChanged } from '../../../actions/userActions.js';
import altImg from '../../../assets/altImg.jpg';
import { putSubscriptions, putGroups } from '../../../api/express.js';
import { putSubscriptionsBegin, putSubscriptionsSuccess, putSubscriptionsFailure, putGroupsBegin, putGroupsSuccess, putGroupsFailure } from '../../../actions/userActions.js';
import { setPrevScreen } from '../../../actions/globalActions.js';
import  LoadingComponent  from '../../../assets/loading.js';

const mapStateToProps = (state) => {
  const { user, vtuber } = state
  return { user, vtuber }
};

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(init()),
  filterChanged: (value) =>  dispatch(filterChanged(value)),
  putSubscriptionsBegin: (enname) => dispatch(putSubscriptionsBegin(enname)),
  putSubscriptionsSuccess: (subscriptions,enname) => dispatch(putSubscriptionsSuccess(subscriptions,enname)),
  putSubscriptionsFailure: (enname) => dispatch(putSubscriptionsFailure(enname)),
  putGroupsBegin: () => dispatch(putGroupsBegin()),
  putGroupsSuccess: (groups) => dispatch(putGroupsSuccess(groups)),
  putGroupsFailure: () => dispatch(putGroupsFailure()),
  setPrevScreen: (input) => dispatch(setPrevScreen(input)),
});

class SubscriptionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastTap: null,
    };
    this.buildData = this.buildData.bind(this);
    this.buildActionSheet = this.buildActionSheet.bind(this);
    this.headerOnPressCallback=this.headerOnPressCallback.bind(this);
  }
  headerOnPressCallback(){
    /*
    Determine if double clicked, when double clicked, goto top
    */
    const now = Date.now();//clicked time
    const DOUBLE_PRESS_DELAY = 1000;//if 2 click within x sec
    if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY) {//if 2 clicks within x sec
      if(this.props.user.subscriptionsGroup === "Daredemo Daisuki" && this.props.user.subscriptions.length > 0){//if selected all vtuber
        this.content.props.scrollToPosition(0, 0);//scroll to top
      }else if(this.props.user.groups.filter((group)=>group.name===this.props.user.subscriptionsGroup)[0].vtubers.length > 0){//if group selected
        this.content.props.scrollToPosition(0, 0);//scroll to top
      }
    } else {
      this.setState({lastTap : now});//update last tap time
    }
  }
  buildData(){
    /*
    Parse data
    */
    var ls;//list of vtber suppose to be displayed
    if(this.props.user.subscriptionsGroup === "Daredemo Daisuki"){//if selected all vtuber
      ls = this.props.user.subscriptions;
    }else{//if group selected
      ls =
      this.props.user.groups
      .filter((group)=>group.name===this.props.user.subscriptionsGroup)[0].vtubers
    }
    var data = [];//data array to be returned
    ls.forEach((vtuber)=>{
      data.push({
        name: this.props.vtuber.vtubersDict[vtuber]?this.props.vtuber.vtubersDict[vtuber].name:vtuber,
        enname: vtuber,
        image: this.props.vtuber.vtubersImage[vtuber],
      })
    })
    return data;
  }
  buildActionSheet(){
    /*
    Render Select Group Action Sheet
    */
    if(this.props.user.groups.length === 0){//if not group, show toast
      NBToast.show({
        text: 'Create groups in "Groups"',
        duration: 2000,
      })
    }else{//if has group, show actionsheet
      var arr = ["Daredemo Daisuki"];//array
      if (this.props && this.props.user && this.props.user.groups){//if have groups
        this.props.user.groups.forEach((group)=>{//for each group add group name
          arr.push(group['name']);
        })
      }
      NBActionSheet.show({
          options: arr,
          title: "Select Group"
        },
        index => {
          if(arr[index]){
            this.props.filterChanged(arr[index]);
          }
        }
      )
    }
  }
  componentDidMount(){
    if(willBlurSubscription){
      willBlurSubscription.remove();
    }
    let willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setPrevScreen("SubscriptionsScreen");
      }
    );
    this.props.init();//init props.user
    this.props.navigation.setParams({headerOnPressCallback: this.headerOnPressCallback, group: this.props.user.subscriptionsGroup });//set header to current screen
  }
  componentDidUpdate(prevProps){
    if((prevProps.user.subscriptionsGroup !== this.props.user.subscriptionsGroup)){//group changes
      this.props.navigation.setParams({group: this.props.user.subscriptionsGroup });//set header to current screen
    }
  }
  render() {
    return (
      <View style={styles(this.props.user.colorTheme).container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={Object.values(this.props.user.subscriptionsLoading).includes(true) || this.props.user.groupsLoading}
          onRequestClose={() => {
          }}>
          <View style={styles(this.props.user.colorTheme).modalContainer}><LoadingComponent duration={1000}/></View>
        </Modal>
        <NBContent style={styles(this.props.user.colorTheme).listContainer} innerRef={ref => { this.content = ref }}>
        <FlatList
          renderItem={({item, index}) => {
              return (
                <View key={index} style={styles(this.props.user.colorTheme).listItem}>
                  <View style={styles(this.props.user.colorTheme).listItemHeader}>
                    <NBThumbnail   style={styles(this.props.user.colorTheme).listItemHeaderImage} source={item.image ?{ uri: item.image }: altImg} />
                    <View style={styles(this.props.user.colorTheme).listItemHeaderTextWrapper}>
                      <Text style={[fontsStyles(this.props.user.font).header,styles(this.props.user.colorTheme).listItemHeaderText]}>{item.name}</Text>
                      <Text style={[fontsStyles(this.props.user.font).subheader,styles(this.props.user.colorTheme).listItemHeaderSubText]}>{item.enname}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles(this.props.user.colorTheme).listItemButton} onPress={()=>{
                    //put subs
                    putSubscriptions(this.props.user.name, this.props.user.password,
                      this.props.user.subscriptions.filter((vtuber)=>{
                        return vtuber !== item.enname;
                      })//filter out unsubs
                      , this.props.putSubscriptionsBegin, this.props.putSubscriptionsSuccess, this.props.putSubscriptionsFailure, ()=>{}, item.enname);
                    //if subs in group, put groups
                    putGroups(this.props.user.name, this.props.user.password,
                      this.props.user.groups.map((group)=>{
                        if(group.vtubers && group.vtubers.includes(item.enname)){//if groups include vtuber
                          group.vtubers = group.vtubers.filter((vtuber)=>{
                            return vtuber !== item.enname;
                          })//filter out the unsubs, not delete group if empty
                        }
                        return group;
                      })
                      ,this.props.putGroupsBegin, this.props.putGroupsSuccess, this.props.putGroupsFailure);
                  }}>
                  <NBSpinner color={colorTheme[this.props.user.colorTheme].textPrimary} style={[{display:
                    this.props.user.subscriptionsLoading&&this.props.user.subscriptionsLoading[item.enname]&&this.props.user.groupsLoading?
                    'flex':'none'},
                    styles(this.props.user.colorTheme).listItemButtonIcon]}/>
                  <Icon name='md-heart-dislike' size={20} style={[{display:
                    !(this.props.user.subscriptionsLoading&&this.props.user.subscriptionsLoading[item.enname]&&this.props.user.groupsLoading)?
                    'flex':'none'},
                    styles(this.props.user.colorTheme).listItemButtonIcon]}/>
                  </TouchableOpacity>
                </View>
              )
            }
          }
          data = {this.buildData()}
          keyExtractor={(item, index) => item + index}
          />
        </NBContent>
        <NBFooter>
          <NBFooterTab>
            <NBButton full style={styles(this.props.user.colorTheme).footerButton} onPress={()=>{this.props.navigation.navigate('SearchScreen')}}>
              <NBText style={[fontsStyles(this.props.user.font).ui, styles(this.props.user.colorTheme).footerText]}> Subscribe To More </NBText>
            </NBButton>
            </NBFooterTab>
        </NBFooter>
        <NBFab
          active={false}
          style={styles(this.props.user.colorTheme).fab}
          position="bottomRight"
          onPress={() => {this.buildActionSheet()}}>
          <Icon name="md-funnel" />
        </NBFab>
      </View>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SubscriptionsScreen)
