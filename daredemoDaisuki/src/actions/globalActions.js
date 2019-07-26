import { SET_PREV_SCREEN } from '../store/type.js';

export const setPrevScreen = (input) => ({
    type: SET_PREV_SCREEN,
    paylad:{
      input: input,
    }
})
