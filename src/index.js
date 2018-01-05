import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './index.css';
import slideshowApp from './reducers';

import App from './App';
import { loadState, saveState } from './manageLocalStorage';

const persistedState = loadState();
const store = createStore(
    slideshowApp,
    persistedState
);

store.subscribe(() => {
    saveState(store.getState());
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
