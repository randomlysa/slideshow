import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// Import routes.
import requireAuth from './requireAuth';
import Slideshow from './Slideshow';
import Admin from './Admin';
import Login from './Login'

// Set some defaults.
let basename = "/bulletin";
let bulletin = "bb1";

// Get pathname, which might be used to get basename and the bulletin to load.
const { pathname } = window.location;
let getDefaults = pathname.split("/");

// Basename of ! is NOT currently supported, but leaving this code here if I
// make it work in the future. Everything else should work just fine.

// Basename is ! and a bulletin name was typed in, so set bulletin name but
// leave basename as the default '/'.
if (getDefaults[1] === "!" && getDefaults[2]) {
  bulletin = getDefaults[2];
// Set basename and or bulletin name.
} else {
  if (getDefaults[1]) {
    basename = getDefaults[1];
  }
  if (getDefaults[2]) {
    bulletin = getDefaults[2];
  }
}

class MyRoutes extends Component {
  render() {
    return (
      <Router basename={basename}>
        <Switch>
          <Route exact path="/admin"
            component={requireAuth(
              () =>
              <Admin
                basename={basename}
              />
            )}
          />
          <Route exact path="/login"
            component={Login}
          />
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
        </Switch>
      </Router>
    )
  } // render
} // class

export default MyRoutes;