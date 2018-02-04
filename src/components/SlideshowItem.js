import React, { Component } from 'react';
import $ from 'jquery';

class SlideshowItem extends Component {

  componentWillReceiveProps() {
    // Hide all images except first. Works on initial load and state change.
    // TODO: confirm that it still works on state change.
    $(".imageHolder:not(:first)").css('display', 'none');
  }

  renderSlideshowItem(item, index) {
      // pass in this.props.server ?
      const itemUrl = `/slideshows/${this.props.dir}/${item.file}`;

      return (
        <div key={item.file} className="imageHolder">
          <img src={itemUrl} alt="Slideshow Item" />
        </div>
      )
    } // renderSlideshowItem

  render() {
    if (this.props.slideshowItems) {
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
} // class SlideshowItem

export default SlideshowItem;
