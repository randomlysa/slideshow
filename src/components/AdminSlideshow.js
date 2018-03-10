import React, { Component } from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

class AdminSlideshow extends Component {

  setWeatherSlide(name, newFilename) {
    const currentConfig = this.props.config.slideToShowWeatherOn.split(';');
    let newConfig;
    // If new filename exists in currentConfig, remove it.
    if (currentConfig.includes(newFilename)) {
      newConfig = currentConfig.filter((filename) => {
        return filename !== newFilename;
      }); // filter
    // If new filename doesn't exist in currentConfig, add it.
    } else {
      newConfig = [...currentConfig, newFilename];
    }

    // Update row 'name', column 'slideToShowWeatherOn' with 'filename'
    // of checked box (slide to show weather on.)
    $.ajax({
      url: `${API_ROOT}/php/sqliteInsertSlideToShowWeatherOn.php`,
      type: 'post',
      dataType: 'json',
      data: {
        name: name,
        slideToShowWeatherOn: newConfig.join(';')
      }
    });
  } // setWeatherSlide

  deleteFile(filename) {
    if(window.confirm("Delete file?")) {
      let { activeFolder } = this.props;
      $.ajax({
        url: `${API_ROOT}/php/deleteFile.php`,
        type: 'POST',
        data: {
          fileToDelete: filename,
          folder: activeFolder
        }
      }) // ajax
      .done((data) => {
        console.log('deleted', data);
        this.props.updateSlideshow(activeFolder);
      }) // ajax done
      .fail((e) => {
        console.log('fail', e);
      }); // ajax fail
    } // if window.confirm
  } // deleteFile


  renderSlideshowItem(filename, index) {
    const fileUrl = `${API_ROOT}/slideshows/${this.props.activeFolder}/${filename}`;
    let checkBoxStatus = '';
    if (this.props.config.slideToShowWeatherOn.includes(filename)) {
      checkBoxStatus = 'checked';
    }

    return (
      <div key={filename}>
        <div className="thumbnail">
          <img
            src={fileUrl}
            alt="Slideshow Item"
            onClick={this.deleteFile.bind(this, filename)}
          />
          <p>Click image to delete file</p>
        </div>
        <div className="showWeatherCheckbox squaredThree">
            <input type="checkbox"
              value={filename}
              name="check"
              onChange={this.setWeatherSlide.bind(this, this.props.activeFolder, filename)}
              checked={checkBoxStatus}
            />
            <label htmlFor={filename}></label>
          </div>
      </div>
    )
  } // renderSlideshowItem

  render() {
    if (this.props.activeFolder && this.props.slideshowItems.files.length > 0) {
      return (
          this.props.slideshowItems.files.map((fileObject, index) => {
            return this.renderSlideshowItem(fileObject.filename, index)
          })
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }; // render
}

function mapStateToProps({ config, slideshowItems }) {
  return { config, slideshowItems };
}

export default connect(mapStateToProps)(AdminSlideshow);
