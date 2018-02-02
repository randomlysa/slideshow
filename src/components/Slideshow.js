import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions'

import Weather from './Weather';
import SlideshowItem from './SlideshowItem';

import '../style.css';
import $ from 'jquery';

class Slideshow extends Component {

  componentDidMount() {
    let transitionDuration = this.props.config.transitionDuration || 2500;
    // slideDisplayDuration needs to have transitionDuration added to it,
    // otherwise if both values are equal, the slideshow will be constantly
    // transitioning.
    let slideDisplayDuration = this.props.config.slideDuration * 1000 +
      parseInt(transitionDuration, 10) || 6000;

    // Loop through the slideshow, fading items out and in.
    setInterval(() => {
      $('#slideshow > div:first')
        .fadeOut(parseInt(transitionDuration, 10))
        .next()
        .fadeIn(parseInt(transitionDuration, 10))
        .end()
        .appendTo('#slideshow');
    },  slideDisplayDuration);
  } // componentDidMount

  render() {
    // Get slideshowDir from props or default to bb1.
    const slideShowDir = this.props.defaultDir || "bb1";

    return (
      <div id="slideshow">
        <Weather />
        <SlideshowItem
          basename={this.props.basename}
          dir={slideShowDir}
        />
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
