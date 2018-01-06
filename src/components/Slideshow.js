import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'

import SlideshowItem from './SlideshowItem';

import '../style.css';
import $ from 'jquery';

class Slideshow extends Component {

  componentDidMount() {

    let fadeDuration = this.props.config.fadeDuration || 2500;
    let slideDisplayDuration = this.props.config.slideDuration * 1000 || 6000;

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

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  return {
      actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slideshow);
