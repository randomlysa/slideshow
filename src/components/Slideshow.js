import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActionCreators from '../actions/admin';
import * as slideshowActionCreators from '../actions/slideshow';
import {withRouter} from 'react-router';

import Weather from './Weather';
import SlideshowItem from './SlideshowItem';

import '../style.css';
import $ from 'jquery';

class Slideshow extends Component {

  componentDidMount() {
    // https://stackoverflow.com/a/45469647/3996097
    // Get slideshowDir from props or default to bb1.
    const slideshowDir = this.props.match.params.name || "bb1";
    this.props.actions.updateSlideshow(slideshowDir);

    // Set some defaults.
    let transitionDuration = this.props.config.transitionDuration || 500;
    // slideDisplayDuration needs to have transitionDuration added to it,
    // otherwise if both values are equal, the slideshow will be constantly
    // transitioning.
    let slideDisplayDuration = this.props.config.slideDuration * 1000 +
      parseInt(transitionDuration, 10) || 6000;

    // Hide all items except first.
    $(".imageHolder:not(:first)").css('display', 'none');

    // Loop through the slideshow, fading items out and in and running update.
    setInterval(() => {
      $('#slideshow > div:first')
        .fadeOut(parseInt(transitionDuration, 10))
        .next()
        .fadeIn(parseInt(transitionDuration, 10))
        .end()
        .appendTo('#slideshow');
        this.props.actions.updateSlideshow(slideshowDir);
    },  slideDisplayDuration);
  } // componentDidMount

  componentDidUpdate(nextprops) {
    // Number of items in slideshow changed. Hide all except first.
    // This seems to update seamlessly, at least in initial testing.
    if (this.props.slideshowItems.length !== nextprops.slideshowItems.length) {
      $(".imageHolder:not(:first)").css('display', 'none');
    }
  }

  render() {
    // Get slideshowDir from route params or default to bb1.
    const slideShowDir = this.props.match.params.name || "bb1";

    return (
      <div id="slideshow">
        <Weather />
        <SlideshowItem
          slideshowItems={this.props.slideshowItems}
          slideshowRoot={this.props.slideshowRoot}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Slideshow));
