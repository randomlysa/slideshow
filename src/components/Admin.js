import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../actions/admin';
import * as slideshowActions  from '../actions/slideshow.js';
import * as slideshowConfigActions  from '../actions/slideshowConfig.js';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

import UploadFiles from './UploadFiles';
import AdminSlideshow from './AdminSlideshow';

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
        slideDuration: props.config.slideDuration || 6,
        transitionDuration: props.config.transitionDuration || 500,
        activeFolder: '',
        slideToShowWeatherOn: '',
        cityToShowWeatherFor: '',
        folders: [],
        uploadDisabled: true,
        existsInDatabase: ''
      };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.confirmLogout = this.confirmLogout.bind(this);
  }

  confirmLogout() {
    if(window.confirm("Logout?")) {
      this.props.actions.logout();
    }
  }

  onInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.actions.updateSlideshowDuration(this.state.slideDuration);
    this.props.actions.updateTransitionDuration(this.state.transitionDuration);

    let url;
    // Insert/update info about slideshow into database.
    if (this.state.existsInDatabase) {
      url = `${API_ROOT}/php/sqliteUpdate.php`;
    } else {
      url = `${API_ROOT}/php/sqliteInsert.php`;
    }
    $.ajax({
      url,
      type: 'POST',
      data: {
        name: this.state.activeFolder,
        slideDuration: this.state.slideDuration,
        transitionDuration: this.state.transitionDuration,
        city: this.state.city,
        slideToShowWeatherOn: this.state.slideToShowWeatherOn,
        cityToShowWeatherFor: this.state.cityToShowWeatherFor
      }
    })
    .done((reponse) => {
      console.log(reponse);
    })
    .fail((e) => {
      console.log(e);
    }) // ajax
  }

  setActiveFolder(e) {
    if (e.target.value) {
      this.setState({
        uploadDisabled: false,
        activeFolder: e.target.value
      }, () => {
        // Run after state has updated.
        // TODO: Getting 404 in console, trying to load images for the
        // wrong slideshow.
        this.props.actions.updateSlideshow(this.state.activeFolder);
        this.props.actions.getConfigFromDatabase(this.state.activeFolder);


      } // setState callback
    ); // setState
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
      url: `${API_ROOT}/php/getFolders.php`,
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
        <button
          className="btn-logout"
          onClick={this.confirmLogout}>
          Logout
        </button>
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
            className="selectActiveFolder"
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

        {this.state.activeFolder &&
          <div className="adminFlexbox">
            <div className="adminFlexbox--Slideshow">
              <AdminSlideshow
                activeFolder={this.state.activeFolder}
                updateSlideshow={this.props.actions.updateSlideshow}
              />
            </div>
            <div className="adminFlexbox--Dropzone">
              <UploadFiles
                activeFolder={this.state.activeFolder}
                uploadStatus={this.state.uploadDisabled}
                updateSlideshow={this.props.actions.updateSlideshow}
              />
            </div>
          </div>
        }

      </div>

    )
  } // render()
} // class Admin extends Component

function mapStateToProps({ config }) {
  return { config };
}

function mapDispatchToProps(dispatch) {
  // Assign { actions } to props.actions
  const actions = {...adminActions, ...slideshowActions, ...slideshowConfigActions};
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
