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

import AdminSlideTransitionDuration from './AdminSlideTransitionDuration';
import AdminSlideshow from './AdminSlideshowSlides';
import AdminWeather from './AdminWeather';

export class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      existsInDatabase: '',
      activeFolder: '',
      uploadDisabled: true,
      keyPress: false,

      // These aren't used until a folder is selected so no point setting them
      // here, they will be changed before being used.

      // slideDuration, transisitonDuration, and cityToShowWeatherFor are
      //'needed' because they are inputs on the page.
      slideDuration: '',
      transitionDuration: '',
      cityToShowWeatherFor: '',

      // These can be moved out of state.
      slidesToShowWeatherOn: '',
      slideOrder: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    // See comment after 'setActiveFolder(e)'
    // Don't update durations from db if they have been changed.
    if (props.config && state.keyPress === false) {
      return {
        slideDuration: props.config.slideDuration,
        transitionDuration: props.config.transitionDuration
      };
    }
    // Allow updating of cityToShowWeatherFor regardless of state.keyPress
    else if (props.config) {
      return {
        cityToShowWeatherFor: props.config.cityToShowWeatherFor
      };
    }
    // Just in case.
    return null;
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
      keyPress: true,
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
      timestamp: Date.now(),
      name: this.state.activeFolder,
      slideDuration: this.state.slideDuration,
      transitionDuration: this.state.transitionDuration,
      slidesToShowWeatherOn: this.state.slidesToShowWeatherOn,
      cityToShowWeatherFor: cityForWeather,
      slideOrder: newSlideOrder
    };

    this.props.actions
      .updateConfigInDatabase(updateOrInsert, dataObject, this.props.env)
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
      // keyPress allows slide and transition durations to override
      // their props values. since the folder changed, set them to false
      // to allow getDerivedState to load the data from props, then
      // set keyPress to true whenever a user tries to change the value
      // for slide or transition duration.
      this.setState(
        {
          uploadDisabled: false,
          activeFolder: e.target.value,
          keyPress: false
        },
        () => {
          // Run after state has updated.
          // TODO: Getting 404 in console, trying to load images for the
          // wrong slideshow.
          this.props.actions.getFilesInSlideshowDir(this.state.activeFolder);
          this.props.actions.getConfigFromDatabase(
            this.state.activeFolder,
            this.props.env
          );

          // Check if the folder config already exists in the database.
          $.ajax({
            url: `${API_ROOT}/php/sqliteGetBulletinConfigByName.php?name=${
              this.state.activeFolder
            }&env=${this.props.env}`,
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
              <AdminSlideTransitionDuration
                onInputChange={this.onInputChange}
                slideDuration={this.state.slideDuration}
                transitionDuration={this.state.transitionDuration}
              />
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
