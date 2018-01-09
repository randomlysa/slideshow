import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';

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
      // Compare new data to slideshowItems to see if state should be updated.
      const newStateIsUnchanged = _.isEqual(newItems, self.state.slideshowItems);

      // State changed.
      if (!newStateIsUnchanged) {
        self.setState({
          slideshowItems: newItems
        });
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
      const itemUrl = `bb1/${item}`;
      let divStyle;

      // Hide all divs except the first.
      if (index > 0) {
        divStyle = {'display': 'none'};
      }

      return (
        <div key={item} style={divStyle}>
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
