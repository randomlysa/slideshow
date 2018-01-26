import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'

import UploadFiles from './UploadFiles';
import AdminSlideshow from './AdminSlideshow';

class Admin extends Component {
  constructor(props) {
    super(props);

    // Set a default of 6 for slideDuration.
    this.state = {
        slideDuration: this.props.config.slideDuration || 6,
        transitionDuration: this.props.config.transitionDuration || 500
      };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.updateSlideshowDuration(this.state.slideDuration);
    this.props.updateTransitionDuration(this.state.transitionDuration);
  }

  render() {
    return (
      <div className="admin">
        <h1>Admin Page</h1>
          <form onSubmit={this.onFormSubmit} className="input-group">
            Slide duration (seconds):
              <input type="number"
                id="slideDuration"
                placeholder="Number (seconds)"
                onChange={this.onInputChange}
                value={this.state.slideDuration}
              />
              <br />
              Transition duration (ms):
              <input type="number"
                id="transitionDuration"
                placeholder="Number (milliseconds)"
                onChange={this.onInputChange}
                value={this.state.transitionDuration}
              /> (1000ms = 1s)
              <br />
            <input type="submit" name="Save" />
          </form>

          <hr style={{'marginBottom': '30px'}} />

          <UploadFiles />
          <AdminSlideshow />

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
