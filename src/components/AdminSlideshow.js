import React, { Component } from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';
import { API_ROOT } from '../api-config';

class AdminSlideshow extends Component {

  deleteFile(item) {
    if(window.confirm("Delete file?")) {
      let { activeFolder } = this.props;
      $.ajax({
        url: `${API_ROOT}/php/deleteFile.php`,
        type: 'POST',
        data: {
          fileToDelete: item.file,
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


  renderSlideshowItem(item, index) {
    const itemUrl = `${API_ROOT}/slideshows/${this.props.activeFolder}/${item.file}`;

    return (
      <div key={item.file} className="thumbnail">
        <img
          src={itemUrl}
          alt="Slideshow Item"
          onClick={this.deleteFile.bind(this, item)}
        />
        <p>Click image to delete file</p>
      </div>
    )
  } // renderSlideshowItem

  render() {
    if (this.props.activeFolder && this.props.slideshowItems) {
      return (
          this.props.slideshowItems.map((item, index) => {
            return this.renderSlideshowItem(item, index)
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
