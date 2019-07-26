import React, { Component } from 'react';
import { Animated, View, Image, Easing } from 'react-native';

import load1 from './load1.png';
import load2 from './load2.png';
import load3 from './load3.png';
import load4 from './load4.png';
import load5 from './load5.png';
import load6 from './load6.png';

export default class LoadingComponent extends Component {
  constructor () {
    super()
    this.animatedValue = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
  }

  componentDidMount() {
    this.animate()
  }

  animate (){
    var duration = 4000;
    if(this.props.duration){
      duration = this.props.duration;
    }
    this.animatedValue[0].setValue(0)
    this.animatedValue[1].setValue(0)
    this.animatedValue[2].setValue(0)
    this.animatedValue[3].setValue(0)
    this.animatedValue[4].setValue(0)
    this.animatedValue[5].setValue(0)
    const animations = [
      Animated.timing(
        this.animatedValue[0],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.animatedValue[1],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.animatedValue[2],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.animatedValue[3],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.animatedValue[4],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.animatedValue[5],
        {
          toValue: 1,
          duration: duration,
          easing: Easing.ease
        }
      )
    ]
    Animated.stagger(200, animations).start(() => this.animate())
  }

  render(){
    const translateY1 = this.animatedValue[0].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity1 = this.animatedValue[0].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    const translateY2 = this.animatedValue[1].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity2 = this.animatedValue[1].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    const translateY3 = this.animatedValue[2].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity3 = this.animatedValue[2].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    const translateY4 = this.animatedValue[3].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity4 = this.animatedValue[3].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    const translateY5 = this.animatedValue[4].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity5 = this.animatedValue[4].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    const translateY6 = this.animatedValue[5].interpolate({
      inputRange: [0, .04, .08, 1],
      outputRange: [0, -25, 0, 0]
    });
    const opacity6 = this.animatedValue[5].interpolate({
      inputRange: [0, .04, .08, .8, 1],
      outputRange: [0, 1, 1, 0, 0]
    });
    return (
      <View>
        <View
          style={{
              flexDirection: 'row',
              justifyContent: 'center',
          }}
        >
          <Animated.View
            style={{
              opacity: opacity1,
              transform: [{translateY: translateY1 }],
            }}
          >
            <Image source={load1}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: opacity2,
              transform: [{translateY: translateY2 }],
            }}
          >
            <Image source={load2}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: opacity3,
              transform: [{translateY: translateY3 }],
            }}
          >
            <Image source={load3}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: opacity4,
              transform: [{translateY: translateY4 }],
            }}
          >
            <Image source={load4}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: opacity5,
              transform: [{translateY: translateY5 }],
            }}
          >
            <Image source={load5}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: opacity6,
              transform: [{translateY: translateY6 }],
            }}
          >
            <Image source={load6}
              style={{
                width: 50,
                height: 50,
                margin: 1
              }}
            />
          </Animated.View>
        </View>
      </View>
    )
  }
}
