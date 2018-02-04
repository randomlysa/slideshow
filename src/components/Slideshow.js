import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActionCreators from '../actions/admin';
import * as slideshowActionCreators from '../actions/slideshow';

import Weather from './Weather';
import SlideshowItem from './SlideshowItem';

import '../style.css';
import $ from 'jquery';

class Slideshow extends Component {

  componentDidMount() {
    this.props.actions.updateSlideshow();

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

  componentWillReceiveProps() {
    // Hide all images except first. Works on initial load and state change.
    // TODO: confirm that it still works on state change.
    $(".imageHolder:not(:first)").css('display', 'none');
  }

  render() {
    // Get slideshowDir from props or default to bb1.
    const slideShowDir = this.props.defaultDir || "bb1";

    return (
      <div id="slideshow">
        <Weather />
        <SlideshowItem
          slideshowItems={this.props.slideshowItems}
          basename={this.props.basename}
          dir={slideShowDir}
        />
      </div>
    )
  }; // render
} // class App

function mapStateToProps({ config, slideshowItems }) {
  return { slideshowItems, config };
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  const actionCreators = {
    ...adminActionCreators, ...slideshowActionCreators
  };

  return {
      actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slideshow);
