import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import combineReducers from '../reducers/index.js';

const persistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, combineReducers)

export const store = createStore(persistedReducer,applyMiddleware(thunk));
export const persistor = persistStore(store);
