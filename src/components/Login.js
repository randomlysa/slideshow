import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { checkPassword } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { password: '' };

    this.inputChange = this.inputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  inputChange(e) {
    this.setState({ password: e.target.value })
  }

  submitForm(event) {
    event.preventDefault();

    this.props.checkPassword(this.state.password)
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.isLoggedIn) {
      this.props.history.push('/admin');
    }
  }

  render() {
    return (
      <div className="admin">
        Login
        <form onSubmit={this.submitForm}>
          <input
            type="password"
            value={this.state.password}
            onChange={this.inputChange}
          />
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
