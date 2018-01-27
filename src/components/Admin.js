import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'
import $ from 'jquery';

import UploadFiles from './UploadFiles';
import AdminSlideshow from './AdminSlideshow';

class Admin extends Component {
  constructor(props) {
    super(props);

    // Set a default of 6 for slideDuration.
    this.state = {
        slideDuration: this.props.config.slideDuration || 6,
        transitionDuration: this.props.config.transitionDuration || 500,
        activeFolder: '',
        folders: [],
        uploadDisabled: true
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

  setActiveFolder(e) {
    if (e.target.value) {
      this.setState({
        uploadDisabled: false,
        activeFolder: e.target.value
      });
    } else {
      this.setState({
        uploadDisabled: true,
        activeFolder: ''
      });
    }
  }

  componentWillMount() {
    // Get list of folders (slideshows) so the user can select a slideshow,
    // upload, sort, and delete slides (images) in the folder.
    $.ajax({
      url: "http://localhost/slideshow/public/php/getFolders.php",
      type: 'GET',
      dataType: 'json'
    })
    .done((data) => {
      let folders = Object.values(data);
      this.setState({ folders });
    })
    .fail((e) => {
      console.log(e);
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

          <select
            name="selectActiveFolder"
            style={{
              'padding': '20px',
              'fontSize': '200%',
              'borderRadius': '40px',
              'width': '100%',
              'marginBottom': '40px'
            }}
            onChange={this.setActiveFolder.bind(this)}
          >
          <option value="">Select a slideshow folder to edit</option>
          {this.state.folders.map((folder) => {
            return (
              <option value={folder} key={folder}>
                {folder}
              </option>
            )
          })}
        </select>

        <UploadFiles
          activeFolder={this.state.activeFolder}
          uploadStatus={this.state.uploadDisabled}
        />
        <AdminSlideshow
          activeFolder={this.state.activeFolder}
          basename={this.props.basename}
        />

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
