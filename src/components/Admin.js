import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'

class Admin extends Component {
  constructor(props) {
    super(props);

    // Set a default of 6 for slideDuration.
    this.state = { slideDuration: this.props.config.slideDuration || '6'};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({ slideDuration: event.target.value })
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.updateSlideshowDuration(this.state.slideDuration);
  }

  render() {
    return (
      <div className="admin">
        <h1>Admin Page</h1>
          <form onSubmit={this.onFormSubmit} className="input-group">
            Slide duration (seconds):
              <input type="number"
                placeholder="Number"
                onChange={this.onInputChange}
                value={this.state.slideDuration}
              />
            <input type="submit" name="Save" />
          </form>
      </div>

    )
  } // render()
} // class Admin extends Component

function mapStateToProps({ config }) {
  return { config };
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
