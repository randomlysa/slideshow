import React, { Component } from 'react';
import swal from 'sweetalert2';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from './actions';
import * as slideshowActions from '../../components/Slideshow/actions_slideshow';
import * as slideshowConfigActions from '../../components/Slideshow/actions_slideshowConfig';

import $ from 'jquery';
import { API_ROOT } from '../../config/api-config';

import UploadFiles from '../UploadFiles';
import AdminSlideshow from './AdminSlideshow';
import AdminWeather from './AdminWeather';

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      activeFolder: '',
      uploadDisabled: true,

      // These aren't used until a folder is selected so no point setting them
      // here, they will be changed before being used.
      slideDuration: '',
      transitionDuration: '',
      slidesToShowWeatherOn: '',
      cityToShowWeatherFor: '',
      slideOrder: '',
      existsInDatabase: ''
    };
  }

  confirmLogout = () => {
    swal({
      title: 'Are you sure?',
      text: 'Logout!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      console.log(result);
      if (result.value) {
        this.props.actions.logout();
      }
    });
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  // Set the variables needed and runs an update.
  callUpdateConfigInDatabase = slideOrder => {
    const newSlideOrder =
      JSON.stringify(slideOrder) || JSON.stringify(this.state.slideOrder);
    let cityForWeather;
    if (typeof this.state.cityToShowWeatherFor === 'object') {
      cityForWeather = JSON.stringify(this.state.cityToShowWeatherFor);
    } else {
      cityForWeather = this.state.cityToShowWeatherFor;
    }
    // Insert/update info about slideshow into database.
    let updateOrInsert;
    if (this.state.existsInDatabase) updateOrInsert = 'update';
    else updateOrInsert = 'insert';

    const dataObject = {
      name: this.state.activeFolder,
      slideDuration: this.state.slideDuration,
      transitionDuration: this.state.transitionDuration,
      slidesToShowWeatherOn: this.state.slidesToShowWeatherOn,
      cityToShowWeatherFor: cityForWeather,
      slideOrder: newSlideOrder
    };
    this.props.actions
      .updateConfigInDatabase(updateOrInsert, dataObject)
      .then(() => {
        swal({
          timer: 1500,
          toast: true,
          position: 'bottom-end',
          text: 'Changes saved!'
        });
      })
      .catch(() => {
        swal({
          timer: 3000,
          toast: true,
          type: 'error',
          text: 'There was an error saving your changes.'
        });
      });
    // Make sure the next save is an update, not an insert.
    this.setState({ existsInDatabase: true });
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.callUpdateConfigInDatabase();
  };

  updateWeatherCheckboxes = slides => {
    this.setState({ slidesToShowWeatherOn: JSON.stringify([...slides]) });
  };

  updateSlideOrder = items => {
    this.setState({ slideOrder: items });
  };

  deleteFile = (filename, folder) => {
    swal({
      title: 'Are you sure?',
      text: 'Delete file',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      // Delete confirmed.
      if (result.value) {
        let updateOrInsert;
        if (this.state.existsInDatabase) updateOrInsert = 'update';
        else updateOrInsert = 'insert';

        const withoutDeletedFile = this.state.slideOrder.filter(item => {
          return item.filename !== filename;
        });
        // Update local state.
        this.setState({ slideOrder: withoutDeletedFile });
        const newConfig = {
          name: this.state.activeFolder,
          slideDuration: this.state.slideDuration,
          transitionDuration: this.state.transitionDuration,
          slidesToShowWeatherOn: this.state.slidesToShowWeatherOn,
          slideOrder: JSON.stringify(withoutDeletedFile)
        };
        this.props.actions.deleteFile(
          filename,
          folder,
          updateOrInsert,
          newConfig
        );
      } // if result.value
    }); // then(result)
  }; // deleteFile

  setActiveFolder(e) {
    if (e.target.value) {
      this.setState(
        {
          uploadDisabled: false,
          activeFolder: e.target.value
        },
        () => {
          // Run after state has updated.
          // TODO: Getting 404 in console, trying to load images for the
          // wrong slideshow.
          this.props.actions.getFilesInSlideshowDir(this.state.activeFolder);
          this.props.actions.getConfigFromDatabase(this.state.activeFolder);

          // Check if the folder config already exists in the database.
          $.ajax({
            url: `${API_ROOT}/php/sqliteGetBulletinConfigByName.php?name=${
              this.state.activeFolder
            }`,
            type: 'GET'
          })
            .done(data => {
              if (data === 'null') {
                this.setState({ existsInDatabase: false });
              } else {
                this.setState({ existsInDatabase: true });
              }
            })
            .fail(e => {
              console.log(e);
            }); // ajax
        } // setState callback
      ); // setState
    } else {
      this.setState({
        uploadDisabled: true,
        activeFolder: ''
      });
    }
  }

  componentDidMount() {
    // Get list of folders (slideshows) so the user can select a slideshow,
    // upload, sort, and delete slides (images) in the folder.
    $.ajax({
      url: `${API_ROOT}/php/getFolders.php`,
      type: 'GET',
      dataType: 'json'
    })
      .done(data => {
        let folders = Object.values(data);
        this.setState({ folders });
      })
      .fail(e => {
        console.log(e);
      });
  }

  componentDidUpdate() {
    if (
      this.state.slideDuration !== this.props.config.slideDuration &&
      this.state.slideDuration !== this.props.config.slideDuration &&
      this.state.transitionDuration !== this.props.config.transitionDuration &&
      this.state.slidesToShowWeatherOn !==
        this.props.config.slidesToShowWeatherOn &&
      this.state.cityToShowWeatherFor !==
        this.props.config.cityToShowWeatherFor &&
      this.state.slideOrder !== this.props.config.slideOrder
    ) {
      this.setState({
        slideDuration: this.props.config.slideDuration,
        transitionDuration: this.props.config.transitionDuration,
        slidesToShowWeatherOn: this.props.config.slidesToShowWeatherOn,
        cityToShowWeatherFor: this.props.config.cityToShowWeatherFor,
        slideOrder: this.props.config.slideOrder
      });
    } // if
  } // componentDidUpdate

  render() {
    return (
      <div className="admin">
        <h1>Admin Page</h1>
        <button className="btn-logout" onClick={this.confirmLogout}>
          Logout
        </button>

        <hr style={{ marginBottom: '30px' }} />

        <select
          data-cy="selectActiveFolder"
          name="selectActiveFolder"
          className="selectActiveFolder"
          onChange={this.setActiveFolder.bind(this)}
        >
          <option value="">Select a slideshow folder to edit</option>
          {this.state.folders.map(folder => {
            return (
              <option value={folder} key={folder}>
                {folder}
              </option>
            );
          })}
        </select>

        {this.state.activeFolder && (
          <div className="adminSection">
            <form onSubmit={this.onFormSubmit}>
              <AdminWeather />
              Slide duration (seconds):
              <input
                type="number"
                id="slideDuration"
                placeholder="Number (seconds)"
                onChange={this.onInputChange}
                value={this.state.slideDuration}
              />
              <br />
              Transition duration (ms):
              <input
                type="number"
                id="transitionDuration"
                placeholder="Number (milliseconds)"
                onChange={this.onInputChange}
                value={this.state.transitionDuration}
              />{' '}
              (1000ms = 1s)
              <br />
              <input type="submit" value="Save" />
            </form>

            <div className="adminFlexbox">
              <div className="adminFlexbox--Slideshow">
                <AdminSlideshow
                  activeFolder={this.state.activeFolder}
                  getFilesInSlideshowDir={
                    this.props.actions.getFilesInSlideshowDir
                  }
                  getConfigFromDatabase={
                    this.props.actions.getConfigFromDatabase
                  }
                  updateSlideOrder={this.updateSlideOrder}
                  updateWeatherCheckboxes={this.updateWeatherCheckboxes}
                  deleteFile={this.deleteFile}
                  callUpdateConfigInDatabase={this.callUpdateConfigInDatabase}
                />
              </div>
              <div className="adminFlexbox--Dropzone">
                <UploadFiles
                  activeFolder={this.state.activeFolder}
                  uploadStatus={this.state.uploadDisabled}
                  getFilesInSlideshowDir={
                    this.props.actions.getFilesInSlideshowDir
                  }
                  uploadFile={this.props.actions.uploadFile}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } // render()
} // class Admin extends Component

function mapStateToProps({ config }) {
  return { config };
}

function mapDispatchToProps(dispatch) {
  // Assign { actions } to props.actions
  const actions = {
    ...adminActions,
    ...slideshowActions,
    ...slideshowConfigActions
  };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);