import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import routes.
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Slideshow from '../components/Slideshow';
import Admin from '../components/Admin/';
import Login from '../components/Login';
import NotFound from '../components/NotFound';

// Import basename.
import { BASENAME, SLIDESHOW_ROOT } from '../config/api-config';

class MyRoutes extends Component {
  render() {
    return (
      <Router basename={BASENAME}>
        <Switch>
          <PrivateRoute exact path="/admin" component={Admin} />
          <PublicRoute exact path="/login" component={Login} />

          {/* make path optional, try to load default if not specified */}
          {/* https://github.com/ReactTraining/react-router/issues/4105#issuecomment-296352338 */}
          <Route
            path="/:name?"
            component={() => <Slideshow slideshowRoot={SLIDESHOW_ROOT} />}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    );
  } // render
} // class

function mapStateToProps({ admin }) {
  // Map isLoggedIn to this.props
  return admin;
}

export default connect(mapStateToProps)(MyRoutes);
