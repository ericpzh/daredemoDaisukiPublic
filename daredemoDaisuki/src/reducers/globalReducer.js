import { SET_PREV_SCREEN } from '../store/type.js';

const initState = {
  loading: false,
  vtubers: [],
}

const search = (state = initState, action) => {
  var {
    prevScreen = 'SplashScreen'
  } = state;

  switch (action.type) {
    case SET_PREV_SCREEN: {
      return {
        ...state,
        prevScreen: action.paylad.input
      }
    }

    default:{
      return state;
    }
  }
}

export default search;
