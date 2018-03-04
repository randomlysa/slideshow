import React, { Component } from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

class AdminSlideshow extends Component {

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

    return (
      <div key={filename} className="thumbnail">
        <img
          src={fileUrl}
          alt="Slideshow Item"
          onClick={this.deleteFile.bind(this, filename)}
        />
        <p>Click image to delete file</p>
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

function mapStateToProps({ slideshowItems }) {
  return { slideshowItems };
}

export default connect(mapStateToProps)(AdminSlideshow);
