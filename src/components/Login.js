import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkPassword } from '../actions/actions_admin';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameLogin: '',
      passwordLogin: '',
      errorMessageLogin: '',
      usernameCreate: '',
      passwordCreate: '',
      emailCreate: '',
      errorMessageCreate: ''
    };

    this.inputChange = this.inputChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  inputChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  submitLogin(event) {
    event.preventDefault();

    if (this.state.password === '') {
      this.setState({ errorMessage: 'Please enter a password.' });
    } else {
      this.props.checkPassword(this.state.password);
      if(!this.props.isLoggedIn) {
        this.setState({errorMessage: 'Password incorrect.'});
      }
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.isLoggedIn) {
      this.props.history.push('/admin');
    }
  }

  render() {
    return (
      <div className="admin">
        <h1>Login</h1>
        <form onSubmit={this.submitLogin}>
          <input
            id="usernameLogin"
            type="username"
            placeholder="Username"
            value={this.state.usernameLogin}
            onChange={this.inputChange}
          />
          <br />
          <input
            id="passwordLogin"
            type="password"
            placeholder="Password"
            value={this.state.passwordLogin}
            onChange={this.inputChange}
          />
          <br />
          <input
              type="submit" />
        </form>
        {this.state.errorMessageLogin}

        <hr />
        <h2>Create Account</h2>
        <form onSubmit={this.submitCreate}>
          <input
            id="usernameCreate"
            type="usernameCreate"
            placeholder="Username"
            value={this.state.usernameCreate}
            onChange={this.inputChange}
          />
          <br />
          <input
            id="passwordCreate"
            type="passwordCreate"
            placeholder="Password"
            value={this.state.passwordCreate}
            onChange={this.inputChange}
          />
          <br />
          <input
            id="emailCreate"
            type="emailCreate"
            placeholder="Email (optional)"
            value={this.state.emailCreate}
            onChange={this.inputChange}
          />
          <br />
          <input
              type="submit" />
        </form>




      </div>
    )
  }
}

function mapStateToProps({ admin }) {
  return admin;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkPassword }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
