import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActionCreators from '../actions/actions_admin';
import * as slideshowActionCreators from '../actions/actions_slideshow';
import * as slideshowConfigActionCreators from '../actions/actions_slideshowConfig.js';
import * as csvActionCreators from '../actions/actions_csv';
import { withRouter } from 'react-router';
import _ from 'lodash';
import $ from 'jquery';

import Weather from './Weather';
import SlideshowItem from './SlideshowItem';

import '../style.css';

import combineOrderedAndUnorderedSlides from '../helpers/slideshowOrder';

// This export is a { named } export for testing.
export class Slideshow extends Component {
  constructor(props) {
    super(props);

    // Check if loadedCsv exists. If not, use an empty array.
    let loadedCsvForState;
    if (this.props.config.loadedCsv) {
      loadedCsvForState = JSON.parse(this.props.config.loadedCsv);
    } else {
      loadedCsvForState = [];
    }

    this.state = {
      // https://stackoverflow.com/a/45469647/3996097
      // Get slideshowDir from props or default to bb1.
      slideshowDir: this.props.match.params.name || 'bb1',
      // Todo: load files that have csv data from database?
      csvRequestedFor: loadedCsvForState,
      // This is passed on to SlideshowItem* to see if class should be set
      // to showWeather.
      slidesToShowWeatherOn: '',
      finalSlideOrder: ''
    };

    this.props.actions.getFilesInSlideshowDir(this.state.slideshowDir);
    // this.props.actions.getConfigFromDatabase(this.state.slideshowDir);
  }

  componentDidMount() {
    this.showWeather = false;

    // finalSlideOrder needs to exist and have a length > 0 for the app to load.
    let finalSlideOrder;
    if (this.props.config.slideOrder) {
      finalSlideOrder = this.props.config.slideOrder;
    } else {
      finalSlideOrder = this.props.slideshowItems.files;
    }
    this.setState({ finalSlideOrder });

    // Loop through the slideshow, fading items out and in and running update.
    // https://stackoverflow.com/a/30725868/3996097

    let firstLoop = true;
    const loop = () => {
      let transitionDuration = this.props.config.transitionDuration || 1500;
      let newSlideDuration;
      if (this.props.config.slideDuration) {
        // slideDuration needs to have transitionDuration added to it,
        // otherwise if both values are equal, the slideshow will be constantly
        // transitioning.
        newSlideDuration =
          this.props.config.slideDuration * 1000 +
          parseInt(transitionDuration, 10);
      } else {
        newSlideDuration = 5000;
      }

      // Set a longer show duration for csv data.
      if ($('#slideshow > div').length > 1) {
        const nextItemClassname = $('#slideshow > div')[1].className;

        if (nextItemClassname.includes('csvHolder')) {
          newSlideDuration = 10000;
        }
      }

      const switchToNextSlide = function() {
        $('#slideshow > div:first')
          .fadeOut(parseInt(transitionDuration, 10))
          .next()
          .fadeIn(parseInt(transitionDuration, 10))
          .end()
          .appendTo('#slideshow');
      };

      if (firstLoop === true) {
        setTimeout(switchToNextSlide, newSlideDuration);
        firstLoop = false;
      } else {
        setTimeout(switchToNextSlide, newSlideDuration);
      }

      // Get classname(s) for current div.
      if ($('#slideshow > div:first')[0]) {
        const thisItem = $('#slideshow > div:first')[0].className;
        // Show weather for divs with classname showWeather.
        this.showWeather = thisItem.includes('showWeather');
      }
      // Check for new slideshow items and config.
      this.props.actions.getFilesInSlideshowDir(this.state.slideshowDir);
      // Todo: why do the slides start switching like crazy with this line
      // commented out?
      this.props.actions.getConfigFromDatabase(this.state.slideshowDir);

      window.setTimeout(loop, newSlideDuration);
    };

    loop();
  } // componentDidMount

  componentWillReceiveProps(nextprops) {
    // Without this, weather never shows on the first slide.
    if ($('#slideshow > div:first')[0]) {
      const thisItem = $('#slideshow > div:first')[0].className;
      // Show weather for divs with classname showWeather.
      this.showWeather = thisItem.includes('showWeather');
    }

    if (nextprops.config.slideOrder) {
      const slideOrder = nextprops.config.slideOrder;
      const { slideshowItems } = nextprops;
      const finalOrder = combineOrderedAndUnorderedSlides(
        slideOrder,
        slideshowItems
      );
      this.setState({ finalSlideOrder: finalOrder });
    } else {
      // If no slideOrder in config, use list of files as the order.
      this.setState({ finalSlideOrder: nextprops.slideshowItems.files });
    } // if nextprops.config.slideOrder

    if (nextprops.config && nextprops.config.slidesToShowWeatherOn) {
      this.setState({
        slidesToShowWeatherOn: nextprops.config.slidesToShowWeatherOn
      });
    }

    // Make an array of csv files.
    const csvFileObjects = _.filter(
      this.props.slideshowItems.files,
      fileObject => {
        const fileType = fileObject.filename.split('.').pop();
        return fileType === 'csv';
      }
    );

    // Get data for CSV files.
    if (csvFileObjects) {
      csvFileObjects.map(csvFileObject => {
        const { filename, md5 } = csvFileObject;

        const findFileInState = _.find(this.state.csvRequestedFor, o => {
          return o.filename === filename;
        });
        const findMd5InState = _.find(this.state.csvRequestedFor, o => {
          return o.md5 === md5;
        });

        // Check if the filename data has not been requested.
        if (!findFileInState && !findMd5InState) {
          // Add csvFileObject to state.
          this.setState(prevState => {
            return {
              csvRequestedFor: [...prevState.csvRequestedFor, csvFileObject]
            };
          });
          // Request data.
          this.props.actions.getCSVData(csvFileObject, this.state.slideshowDir);
        } // if file hasn't been requested.
      }); // csvFileObjects.map
    } // if(csvFileObjects)
  } // componentWillReceiveProps

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
        $('.slideshowItem:not(:first)').css('display', 'none');
      }
    }
  }

  render() {
    if (this.state.finalSlideOrder && this.state.finalSlideOrder.length > 0) {
      return (
        <div id="slideshowContainer">
          {this.showWeather && <Weather />}

          <div id="slideshow">
            <SlideshowItem
              slidesToShowWeatherOn={this.state.slidesToShowWeatherOn}
              slideshowItems={this.state.finalSlideOrder}
              dir={this.state.slideshowDir}
            />
          </div>
        </div>
      );
    } else {
      return <h1 className="loading">Loading</h1>;
    }
  } // render
} // class App

function mapStateToProps({ config, slideshowItems }) {
  return { slideshowItems, config };
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  const actionCreators = {
    ...adminActionCreators,
    ...slideshowActionCreators,
    ...csvActionCreators,
    ...slideshowConfigActionCreators
  };

  return {
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Slideshow)
);
