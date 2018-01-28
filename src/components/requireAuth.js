//  https://stackoverflow.com/a/42708437/3996097
import React from 'react';
import { withRouter } from 'react-router';

export default function requireAuth(Component) {

  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth();
    }

    checkAuth() {
      if ( ! this.props.isLoggedIn) {
        const location = this.props.location;
        const redirect = location.pathname + location.search;

        this.props.history.push(`/login?redirect=${redirect}`);
      }
    }

    render() {
      return this.props.isLoggedIn
        ? <Component { ...this.props } />
        : null;
    }
  } // class ... extends

  return withRouter(AuthenticatedComponent);

} // export default function
