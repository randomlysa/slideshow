import React, { Component } from 'react';
import '../style.css';
import $ from 'jquery';
import SlideshowItem from './SlideshowItem';

class Slideshow extends Component {
  componentDidMount() {
    const fadeDuration = 2500;
    const slideDisplayDuration = '6000';

    // Hide all images except first on load.
    const displayFirstImage = setTimeout(() => {
      if ($('#slideshow > div:gt(0)')) {
          $('#slideshow > div:gt(0)').hide();
          clearInterval(displayFirstImage);
      }
    }, 50);

    // Loop through the slideshow, fading items out and in.
    setInterval(() => {
      $('#slideshow > div:first')
        .fadeOut(fadeDuration)
        .next()
        .fadeIn(fadeDuration)
        .end()
        .appendTo('#slideshow');
    },  slideDisplayDuration);
  } // componentDidMount

  render() {
    return (
      <div id="slideshow">
        <SlideshowItem />
      </div>
    )
  }; // render
} // class App

export default Slideshow;
