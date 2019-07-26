import React, { Component } from 'react';
import { Animated, View, Image, Easing } from 'react-native';

export default class ShakingComponent extends Component {
  constructor () {
    super()
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  animate (){
    var duration = 1000;
    if(this.props.duration){
      duration = this.props.duration;
    }
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: duration,
        easing: Easing.ease
      }
    ).start(() => this.animate())
  }

  render(){
    const moveRangeX = this.props.moveRangeX?this.props.moveRangeX:1;
    const moveRangeY = this.props.moveRangeY?this.props.moveRangeY:1;
    const translateX = this.animatedValue.interpolate({
      inputRange: [0, .33 + (Math.random()-0.5)*0.05, .66 + (Math.random()-0.5)*0.05, 1],
      outputRange: [0, -moveRangeX, 0, moveRangeX]
    });
    const translateY = this.animatedValue.interpolate({
      inputRange: [0, .33 + (Math.random()-0.5)*0.05, .66 + (Math.random()-0.5)*0.05, 1],
      outputRange: [-moveRangeY, 0 , moveRangeY, 0]
    });
    return (
      <Animated.View
        style={{
          transform: [{translateX: translateX}, {translateY: translateY}],
        }}
      >
        {this.props.component}
      </Animated.View>
    )
  }
}
