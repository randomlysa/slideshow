import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import crossTabMiddleware from 'cross-tab-middleware';

import slideshowApp from '../reducers';

// https://github.com/rt2zz/redux-persist
const persistConfig = {
  key: 'slideshow',
  storage
};

// (config, reducer)
const persistedReducer = persistReducer(persistConfig, slideshowApp);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export let store = createStore(
  persistedReducer,
  composeEnhancers(
  applyMiddleware(
      thunk,
      promiseMiddleware(),
      crossTabMiddleware('slideshow')
  ))
);

export let persistor = persistStore(store);
persistStore(store);
