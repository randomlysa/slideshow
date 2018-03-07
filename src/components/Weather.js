import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWeatherFromLocalStorage, fetchWeatherFromOpenWeather } from '../actions/actions_weather';

class Weather extends Component {
  componentWillMount() {
    // fetchWeatherFromOpenWeather if fetchWeatherFromLocalStorage is empty.
    this.props.actions.fetchWeatherFromLocalStorage();
    if (this.props.weather.length === 0) {
      // If weather wasn't fetched from localstorage.
      const city = JSON.parse(this.props.config.cityToShowWeatherFor);
      this.props.actions.fetchWeatherFromOpenWeather(city[0].ID);
    }
  }

  render() {
    if (this.props.weather && this.props.weather.length > 0) {
      return (
        <h2 className="weather">
          {this.props.weather[0].name} &nbsp;
          {Math.round(this.props.weather[0].main.temp)}&deg; C / &nbsp;
          {Math.round(this.props.weather[0].main.temp * 9/5 + 32)}&deg; F
        </h2>
      )
    } else {
      return "Loading";
    }
  } // Render
} // class

function mapStateToProps({ config, weather }) {
  return { config, weather } ;
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
