import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActionCreators from '../actions/admin';
import * as slideshowActionCreators from '../actions/slideshow';
import * as csvActionCreators from '../actions/csv';
import {withRouter} from 'react-router';
import _ from 'lodash';

import Weather from './Weather';
import SlideshowItem from './SlideshowItem';

import '../style.css';
import $ from 'jquery';

class Slideshow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayWeather: false,
      // https://stackoverflow.com/a/45469647/3996097
      // Get slideshowDir from props or default to bb1.
      slideshowDir: this.props.match.params.name || "bb1"
    }
  }

  componentDidMount() {
    this.props.actions.updateSlideshow(this.state.slideshowDir);

    // Set some defaults.
    let transitionDuration = this.props.config.transitionDuration || 500;
    // slideDisplayDuration needs to have transitionDuration added to it,
    // otherwise if both values are equal, the slideshow will be constantly
    // transitioning.
    let slideDisplayDuration = this.props.config.slideDuration * 1000 +
      parseInt(transitionDuration, 10) || 6000;


    // Hide all items except first.
    $(".slideshowItem:not(:first)").css('display', 'none');

    // Loop through the slideshow, fading items out and in and running update.
    // https://stackoverflow.com/a/30725868/3996097
    function loop() {
      let newSlideDisplayDuration = slideDisplayDuration;

      // Set a longer show duration for csv data.
      if ($('#slideshow > div').length > 1) {
        const nextItemClassname = $('#slideshow > div')[1].className;

        if (nextItemClassname.includes('csvHolder')) {
          newSlideDisplayDuration = 10000;
        }
      }

      $('#slideshow > div:first')
        .fadeOut(parseInt(transitionDuration, 10))
        .next()
        .fadeIn(parseInt(transitionDuration, 10))
        .end()
        .appendTo('#slideshow');
      this.props.actions.updateSlideshow(this.state.slideshowDir);

      window.setTimeout(boundLoop, newSlideDisplayDuration);
    };

    var boundLoop = loop.bind(this);
    boundLoop();

  } // componentDidMount

  componentWillReceiveProps() {
    // let displayWeather = $('#slideshow > div:first')[0].innerHTML.includes('/11.jpg');
    // this.setState({ displayWeather });

    // Check for csv file. (Assuming only one file for now.)
    const csvFile = _.find(this.props.slideshowItems.files, function(obj) {
      if (obj) {
        const fileType = obj.file.split('.').pop();
        return fileType === 'csv';
      }
    });
    if (csvFile && !this.props.slideshowItems.csv) {
      // Todo: Don't assume 'bb1.'
      this.props.actions.getCSVData(csvFile, this.state.slideshowDir);
    }
  }

  componentDidUpdate(nextprops) {
    // Number of items in slideshow changed. Hide all except first.
    // This seems to update seamlessly, at least in initial testing.

    // Todo: If slides have a long show duration, and an item is removed and a
    // different item is added before this check runs, will the new item be
    // hidden?

    const thisItems = this.props.slideshowItems;
    const nextItems = nextprops.slideshowItems;
    if (thisItems.files && nextItems.files) {
      if (thisItems.files.length !== nextItems.files.length) {
        $(".nextItemsowItem:not(:first)").css('display', 'none');
      }
    }
  }


  render() {

    if (this.props.slideshowItems.files && this.props.slideshowItems.files.length > 0) {
      return (
        <div id="slideshow">
          {this.state.displayWeather &&
          <Weather />
          }
          <SlideshowItem
            slideshowItems={this.props.slideshowItems}
            slideshowRoot={this.props.slideshowRoot}
            dir={this.state.slideshowDir}
          />
        </div>
      )
    } else {
      return 'Loading';
    }
  }; // render
} // class App

function mapStateToProps({ config, slideshowItems }) {
  return { slideshowItems, config };
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  const actionCreators = {
    ...adminActionCreators, ...slideshowActionCreators, ...csvActionCreators
  };

  return {
      actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Slideshow));
