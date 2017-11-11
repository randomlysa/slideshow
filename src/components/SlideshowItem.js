import React, { Component } from 'react';
import $ from 'jquery';

class SlideshowItem extends Component {

  // Schedule updateSlideshow to run every x seconds.
  updateSlideshowTimer = () => {
    window.setInterval(this.updateSlideshow, 3000);
  }

  // Get list of files, update state.
  updateSlideshow = () => {
    const self = this;
    const url = window.location.href;
    let server;

    if (url === "http://localhost:3000/") {
      server = "http://localhost/slideshow/public" // use localhost with php
    } else {
      server = "http://code.randomlysa.com/slideshow"
    }

    $.ajax({
      url: `${server}/php/getFiles.php`,
      dataType: 'json'
    })
    .done((data) => {
      let newItems = Object.values(data);
      self.setState({
        slideshowItems: newItems
      });
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

  renderSlideshowItem(item) {
      const itemUrl = `bb1/${item}`;

      return (
        <div key={item}>
          <img src={itemUrl} alt="Slideshow Item" />
        </div>
      )
    } // renderSlideshowItem

  render() {
    if (this.state && this.state.slideshowItems) {
      return (
        <div>
          {this.state.slideshowItems.map(function(item) {
            return this.renderSlideshowItem(item)
            }, this)
          }
        </div>
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }; // render
} // class SlideshowItem

export default SlideshowItem;
