import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWeatherFromLocalStorage, fetchWeatherFromOpenWeather } from '../actions/weather';

class Weather extends Component {
  componentWillMount() {
    // fetchWeatherFromOpenWeather if fetchWeatherFromLocalStorage is empty.
    this.props.actions.fetchWeatherFromLocalStorage();
    if (this.props.weather.length === 0) {
      this.props.actions.fetchWeatherFromOpenWeather();
    }
  }

  render() {
    if (this.props.weather && this.props.weather.length > 0) {
      return (
        <h2 className="weather">{this.props.weather[0].main.temp}&deg; C</h2>
      )
    } else {
      return "Loading";
    }
  } // Render
} // class

function mapStateToProps({ weather }) {
  return { weather } ;
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  return {
    actions:
    bindActionCreators( {
      fetchWeatherFromLocalStorage,
      fetchWeatherFromOpenWeather
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
