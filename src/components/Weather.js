import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWeatherFromLocalStorage, fetchWeatherFromOpenWeather } from '../actions/actions_weather';

class Weather extends Component {
  componentWillMount() {
    // fetchWeatherFromOpenWeather if fetchWeatherFromLocalStorage is empty.
    this.props.actions.fetchWeatherFromLocalStorage();
    // If weather isn't an empty string.
    if (this.props.config.cityToShowWeatherFor !== "") {
      const cityFromDB = JSON.parse(this.props.config.cityToShowWeatherFor);
      // If weather wasn't loaded from localstorage.
      // OR
      // If  weather loaded from localstorage is not for the same city id that is
      // in the database.
      if ((this.props.weather.length === 0) ||
          (this.props.weather[0].id !== parseInt(cityFromDB.ID, 10)))
      {
        this.props.actions.fetchWeatherFromOpenWeather(cityFromDB.ID);
      }
    }
  } // componentWillMount

  render() {
    // There is no city to show weather for. Return nothing.
    if (this.props.config.cityToShowWeatherFor === "") return null;

    else if (this.props.weather && this.props.weather.length > 0) {
      return (
        <h2 className="weather">
          {this.props.weather[0].name} &nbsp;
          {Math.round(this.props.weather[0].main.temp)}&deg; C / &nbsp;
          {Math.round(this.props.weather[0].main.temp * 9/5 + 32)}&deg; F
        </h2>
      )
    } else {
      // Adding a class keeps the text from showing up at the top of the page
      // and making the image move down - not an effect I'm going for.
      return (
        <p className="weather">
          Loading Weather...
        </p>
      )
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
