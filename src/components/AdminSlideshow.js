import React, { Component } from 'react';
import $ from 'jquery';

let server;
const origin = window.location.origin;

if (origin.includes("http://localhost:3000")) {
  server = "http://localhost/slideshow/public" // use localhost with php
} else {
  // Set path for ajax requests.
  server = `${origin}/${this.props.basename}`;
}

class AdminSlideshow extends Component {

  updateSlideshow = (activeFolder) => {
    const self = this;

    $.ajax({
      url: `${server}/php/getFiles.php?dir=${activeFolder}`,
      dataType: 'json'
    }) // ajax
    .done((data) => {
      self.setState({
        slideshowItems: Object.values(data)
      });
    }) // ajax done
    .fail((e) => {
      console.log(e);
    }) // ajax fail
  } // updateSlideShow

  deleteFile(item) {
    if(window.confirm("Delete file?")) {
      let { activeFolder } = this.state;
      $.ajax({
        url: `${server}/php/deleteFile.php?`,
        type: 'POST',
        data: {
          fileToDelete: item,
          folder: activeFolder
        }
      }) // ajax
      .done((data) => {
        console.log('deleted', data)
        this.updateSlideshow(activeFolder);
      }) // ajax done
      .fail((e) => {
        console.log('fail', e);
      }) // ajax fail
    } // if window.confirm
  } // deleteFile

  componentWillReceiveProps(nextProps){
    this.setState({
      activeFolder: nextProps.activeFolder,
      slideshowItems: this.updateSlideshow(nextProps.activeFolder)
    });
  } // componentWillReceiveProps

  renderSlideshowItem(item, index) {
    const itemUrl = `${server}/slideshows/${this.props.activeFolder}/${item}`;

    return (
      <div key={item} className="thumbnail">
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
    if (this.state && this.state.slideshowItems) {
      return (
          this.state.slideshowItems.map((item, index) => {
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

export default AdminSlideshow;
