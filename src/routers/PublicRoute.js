import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    component={props =>
      isAuthenticated ? <Redirect to="/admin" /> : <Component {...props} />
    }
  />
);

function mapStateToProps(state) {
  return { isAuthenticated: !!state.admin.token };
}

export default connect(mapStateToProps)(PublicRoute);
