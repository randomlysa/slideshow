import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route {...rest} component={(props) => (
    isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to="/login" />
    )

  )} />
);

function mapStateToProps({ admin }) {
  return { isAuthenticated: !!admin.token };
}

export default connect(mapStateToProps)(PrivateRoute);