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


// Origin = http://something.com:port
const { pathname } = window.location;
let basename;

// Get basepath from pathname.
let getDefaults = pathname.split("/");

// getDefaults[0] is always empty. [1] is the basename and [2] is the bulletin
// path, but that isn't used here.
if (getDefaults[1]) {
    basename = getDefaults[1];
} else {
    basename = "/";
}

ReactDOM.render(
    <Provider store={store}>
        <Router basename={basename}>
            <div>
                {/* make path optional, try to load default if not specified */}
                <Route path="/:name?" component={Slideshow} />
                <Route exact path="/admin" component={Admin} />
            </div>
       </Router>
    </Provider>,
    document.getElementById('root')
);
