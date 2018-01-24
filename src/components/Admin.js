import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'
import $ from 'jquery';

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
    this.setState({ [event.target.id]: event.target.value })
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.updateSlideshowDuration(this.state.slideDuration);
    this.props.updateTransitionDuration(this.state.transitionDuration);
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      // formData: https://stackoverflow.com/a/24939229/3996097
      var formData = new FormData();
      formData.append('photo', file);
      // Todo: set folder to upload file to.
      // formData.append('folder', '');

      // http://localhost/slideshow/public/php/uploadFiles.php
      $.ajax({
        url: "http://localhost/slideshow/public/php/uploadFiles.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false
      })
      .done((data) => {
        console.log(data);
      })
      .fail((e) => {
        console.log(e);
      });
    });
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

          <Dropzone
            onDrop={this.onDrop.bind(this)}
            style={{
              'padding': '50px',
              'border': 'dashed 1px #000',
              'borderRadius': '40px'
            }}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>

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
