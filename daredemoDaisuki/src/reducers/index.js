import { combineReducers } from 'redux';

import youtubeReducer from './youtubeReducer.js';
import twitterReducer from './twitterReducer.js';
import biliReducer from './biliReducer.js';
import searchReducer from './searchReducer.js';
import userReducer from './userReducer.js';
import vtuberReducer from './vtuberReducer.js';
import reportReducer from './reportReducer.js';
import globalReducer from './globalReducer.js';

export default combineReducers({
  global: globalReducer,
  youtube: youtubeReducer,
  search: searchReducer,
  user: userReducer,
  vtuber: vtuberReducer,
  twitter: twitterReducer,
  bili: biliReducer,
  report: reportReducer,
})
