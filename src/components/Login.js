import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkPassword } from '../actions/actions_admin';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      errorMessage: ''
    };

    this.inputChange = this.inputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  inputChange(e) {
    this.setState({ password: e.target.value });
  }

  submitForm(event) {
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
        <form onSubmit={this.submitForm}>
          <input
            type="password"
            value={this.state.password}
            onChange={this.inputChange}
          />
          <input
              type="submit" />
        </form>
        {this.state.errorMessage}

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
