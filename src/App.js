import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import SlideshowItem from './components/SlideshowItem';

class App extends Component {
  componentDidMount() {
    const fadeDuration = 0;
    const slideDisplayDuration = '3000';

    // Hide all images except first on load.
    const displayFirstImage = setTimeout(function() {
      if ($('#slideshow > div > div:gt(0)')) {
          $('#slideshow > div > div:gt(0)').hide();
          clearInterval(displayFirstImage);
      }
    }, 50);

    // Loop through the slideshow, fading items out and in.
    setInterval(function() {
      $('#slideshow > div > div:first')
        .fadeOut(fadeDuration) // fadeOut isn't working properly, set to 0 for now.
        .next()
        .fadeIn(fadeDuration)
        .end()
        .appendTo('#slideshow > div');
    },  slideDisplayDuration);
  } // componentDidMount

  render() {
    return (
      <div id="slideshow">
        <SlideshowItem />
      </div>
    )
  };

} // class App

export default App;
