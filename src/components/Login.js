import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkPassword } from '../actions/actions_admin';
import password from 'password-hash-and-salt';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

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
    this.submitCreate = this.submitCreate.bind(this);
  }

  inputChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  submitLogin(event) {
    event.preventDefault();

    if (this.state.password === '') {
      this.setState({ errorMessageLogin: 'Please enter a password.' });
    } else {
      this.props.checkPassword(this.state.password);
      if(!this.props.isLoggedIn) {
        this.setState({errorMessageLogin: 'Password incorrect.'});
      }
    }
  }

  submitCreate(e) {
    const self = this;
    e.preventDefault();

    if (this.state.usernameCreate ==- '') {
      this.setState({ errorMessageCreate: 'Please enter a username.' });
      return;
    }

    if (this.state.passwordCreate ==- '') {
      this.setState({ errorMessageCreate: 'Please enter a password.' });
      return;
    }

    password(this.state.passwordCreate).hash(function(error, hash) {
      if(error) {
        throw new Error('Something went wrong!');
      } else {

        // Post info to database.
        $.ajax({
          url: `${API_ROOT}/php/sqliteCreateUser.php`,
          type: 'post',
          dataType: 'json',
          data: {
            username: self.state.usernameCreate,
            password: hash,
            email: self.state.emailCreate
          }
        })
         .done(data => {
           console.log(data)
         })
         .fail(e => {
           console.log(e);
         }); // ajax
      } // else
    }); // password()
  }; // submitCreate

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
            type="password"
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
          <input type="submit" />
          <br />
          {this.state.errorMessageCreate}
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
