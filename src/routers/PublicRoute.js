import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({
  env,
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  let goTo = '/admin';
  if (env === 'test') goTo = '/admin/test';
  return (
    <Route
      {...rest}
      component={props =>
        isAuthenticated ? <Redirect to={goTo} /> : <Component {...props} />
      }
    />
  );
};

function mapStateToProps(state) {
  return { isAuthenticated: !!state.admin.token };
}

export default connect(mapStateToProps)(PublicRoute);
