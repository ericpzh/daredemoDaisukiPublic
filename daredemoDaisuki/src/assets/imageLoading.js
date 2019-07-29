import React, { Component } from 'react';
import { Animated, View, Image, Easing, ImageBackground } from 'react-native';

import load1 from './load1.png';
import loadBackground from './loadBackground.png';
import loadForeground from './loadForeground.png';

export default class ImageLoadingComponent extends Component {
  constructor () {
    super()
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.animate()
  }

  animate (){
    let duration = this.props.duration?this.props.duration:1000;
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: duration,
      }
    ).start(() => this.animate())
  }

  render(){
    const rotate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <ImageBackground
        source={loadBackground}
        style = {{
          width: 50,
          height: 50,
        }}
      >
        <Animated.Image
          source={loadForeground}
          style={{
            transform: [{rotate: rotate }],
            width: 50,
            height: 50,
            borderRadius: 10,
          }}
          resizeMode="contain"
        />
        <Animated.Image
          source={load1}
          style={{
            width: 35,
            height: 35,
            position: 'absolute',
            left: 8.75,
            top: 5.25,
          }}
          resizeMode="contain"
        />

      </ImageBackground>
    )
  }
}
