import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { styles, fontsStyles }from '../../../styles/App/Home/homeTutorialStyles.js';

const mapStateToProps = (state) => {
  const { user } = state
  return { user }
};

const mapDispatchToProps = dispatch => ({
});

class Tutorial extends React.Component {
  render() {
    return (
        <View/>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Tutorial)
