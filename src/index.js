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

// If serving from /aPathName, set this to true.
// If serving from /, set to false.
// Also update .htaccess to be /path/index.html or /index.html.
const customBasename = true;

// Set some defaults.
let basename = "/";
let  bulletin = "bb1";

// Get pathname, which might be used to get basename and the bulletin to load.
const { pathname } = window.location;
let getDefaults = pathname.split("/");

// pathname will be /basename/bulletin (bulletin is optional, default to bb1)
if (customBasename) {
    // getDefaults[0] is always empty. [1] is the basename and [2] is the bulletin
    // path, but that isn't used here.
    if (getDefaults[1]) {
        basename = getDefaults[1];
    }
    if (getDefaults[2]) {
        bulletin = getDefaults[2];
    }
// basename is '/', pathname will be /bulletin (optional, default to bb1)
} else {
    basename = '/';
    bulletin = getDefaults[1];
}

ReactDOM.render(
    <Provider store={store}>
        <Router basename={basename}>
            <div>
                {/* make path optional, try to load default if not specified */}
                {/* https://github.com/ReactTraining/react-router/issues/4105#issuecomment-296352338 */}
                <Route path="/:name?"
                    component={
                        () =>
                            <Slideshow
                                basename={basename}
                                defaultDir={bulletin}
                            />
                    }
                />
                <Route exact path="/admin" component={Admin} />
            </div>
       </Router>
    </Provider>,
    document.getElementById('root')
);
