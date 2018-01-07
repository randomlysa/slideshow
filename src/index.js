import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './index.css';
import slideshowApp from './reducers';

import Slideshow from './components/Slideshow';
import Admin from './components/Admin';

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
        <Router>
            <div>
                <Route exact path="/" component={Slideshow} />
                <Route exact path="/admin" component={Admin} />
            </div>
       </Router>
    </Provider>,
    document.getElementById('root')
);
