import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';

let server;

class SlideshowItem extends Component {

  // Schedule updateSlideshow to run every x seconds.
  updateSlideshowTimer = () => {
    window.setInterval(this.updateSlideshow, 3000);
  }

  // Get list of files, update state.
  updateSlideshow = () => {
    const self = this;
    const origin = window.location.origin;

    if (origin.includes("http://localhost:3000")) {
      server = "http://localhost/slideshow/public" // use localhost with php
    } else {
      // Set path for ajax requests.
      server = `${origin}/${window.location.pathname.split("/")[1]}`;
    }

    $.ajax({
      url: `${server}/php/getFiles.php?dir=${this.props.dir}`,
      dataType: 'json'
    })
    .done((data) => {
      let newItems = Object.values(data);

      // Compare new data to slideshowItems to see if state should be updated.
      const newStateIsUnchanged = _.isEqual(newItems, self.state.slideshowItems);

      // State changed.
      if (!newStateIsUnchanged) {
        $(".imageHolder").fadeOut();
        self.setState({
          slideshowItems: newItems
        });
        // Hide all images except first. Works on initial load and state change.
        $(".imageHolder:not(:first)").css('display', 'none');
      }

    })
    .fail((e) => {
      console.log(e);
    });
  } // updateSlideShow

  componentDidMount() {
    this.updateSlideshowTimer();
    this.setState({
      slideshowItems: this.updateSlideshow()
    });
  } // componentDidMount

  renderSlideshowItem(item, index) {
      const itemUrl = `${server}/slideshows/${this.props.dir}/${item}`;

      return (
        <div key={item} className="imageHolder">
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
} // class SlideshowItem

export default SlideshowItem;
