import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import crossTabMiddleware from 'cross-tab-middleware';

import './index.css';
import slideshowApp from './reducers';
import MyRoutes from './routers/MyRoutes';

// https://github.com/rt2zz/redux-persist
const persistConfig = {
    key: 'slideshow',
    storage
};

// (config, reducer)
const persistedReducer = persistReducer(persistConfig, slideshowApp);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
    persistedReducer,
    composeEnhancers(
    applyMiddleware(
        promiseMiddleware(),
        crossTabMiddleware('slideshow')
    ))
);

let persistor = persistStore(store);
persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MyRoutes />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
