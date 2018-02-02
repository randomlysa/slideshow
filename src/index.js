import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise  from 'redux-promise';

import './index.css';
import slideshowApp from './reducers';

import MyRoutes from './components/MyRoutes';

import { loadState, saveState } from './manageLocalStorage';

const persistedState = loadState();

const store = createStore(
    slideshowApp,
    persistedState,
    applyMiddleware(ReduxPromise),
);

store.subscribe(() => {
    saveState(store.getState());
});

ReactDOM.render(
    <Provider store={store}>
        <MyRoutes />
    </Provider>,
    document.getElementById('root')
);
