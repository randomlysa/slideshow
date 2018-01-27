import React, { Component } from 'react';
import $ from 'jquery';

let server;

class AdminSlideshow extends Component {

  updateSlideshow = (activeFolder) => {
    const self = this;
    const origin = window.location.origin;

    if (origin.includes("http://localhost:3000")) {
      server = "http://localhost/slideshow/public" // use localhost with php
    } else {
      // Set path for ajax requests.
      server = `${origin}/${this.props.basename}`;
    }

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

  componentWillReceiveProps(nextProps){
    this.setState({
      slideshowItems: this.updateSlideshow(nextProps.activeFolder)
    });
  }

  renderSlideshowItem(item, index) {
    const itemUrl = `${server}/slideshows/${this.props.activeFolder}/${item}`;

    return (
      <div key={item} className="thumbnail">
        <img src={itemUrl} alt="Slideshow Item" />
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
