import React from 'react';
import { View, Image, Animated, Easing } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import loginBackground1 from './loginBackground1.jpg';
import loginBackground2 from './loginBackground2.jpg';
import appBackground1 from './appBackground1.jpg';
import appBackground2 from './appBackground2.jpg';

export default class Carousel extends React.Component {
  constructor () {
    super()
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  animate (){
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 20000,
        easing: Easing.ease
      }
    ).start(() => this.animate())
  }

  render() {
    var opacitymult = 1;
    if (this.props.opacity){
      opacitymult = this.props.opacity;
    }
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.025, .45, .475, .5, .525, .95, .975, 1],
      outputRange: [0.75*opacitymult, 1*opacitymult, 1*opacitymult, 0.75*opacitymult, 0.75*opacitymult, 1*opacitymult, 1*opacitymult, 0.75*opacitymult, 0.75*opacitymult ]
    });
    const left1 = this.animatedValue.interpolate({
      inputRange: [0, .475, .5, .975, 1],
      outputRange: [0, 0, -this.props.width, -this.props.width, 0]
    });
    const left2 = this.animatedValue.interpolate({
      inputRange: [0, .475, .5, .975, 1],
      outputRange: [this.props.width, this.props.width, 0, 0, this.props.width]
    });

    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Animated.Image
          source={this.props.appBackground?appBackground1:loginBackground1}
          style={{
            opacity: opacity,
            position:'absolute',
            left:0,
            right:0,
            top:0,
            bottom:0,
            width: undefined,
            height: undefined,
            resizeMode: 'cover',
            transform: [{translateX: left1}],
          }}
        />
        <Animated.Image
          source={this.props.appBackground?appBackground2:loginBackground2}
          style={{
            opacity: opacity,
            position:'absolute',
            left:0,
            right:0,
            top:0,
            bottom:0,
            width: undefined,
            height: undefined,
            resizeMode: 'cover',
            transform: [{translateX: left2 }],
          }}
        />
      </View>
    );
  }
}
