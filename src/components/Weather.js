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

      const now = new Date().getTime();
      const timeFetched = this.props.weather ? this.props.weather.timeFetched : null;
      const timeDifference = (now - timeFetched) / 1000 / 60;

      // Update weather if:
      // timedifference is > 30 (weather is > 30 min old)
      // weather wasn't loaded from localstorage.
      // weather loaded from localstorage is not for the same city id that is
      // in the database (the city in the database was updated.)
      if (timeDifference > 30 ||
          (!this.props.weather.name) ||
          (this.props.weather.id !== parseInt(cityFromDB.ID, 10)))
      {
        this.props.actions.fetchWeatherFromOpenWeather(cityFromDB.ID);
      }
    }
  } // componentWillMount

  render() {
    // There is no city to show weather for. Return nothing.
    if (this.props.config.cityToShowWeatherFor === "") return null;

    else if (this.props.weather) {
      const { icon, description } = this.props.weather.weather[0];
      const iconSrc = `http://openweathermap.org/img/w/${icon}.png`;

      return (
        <h2 className="weather">
          {this.props.weather.name} &nbsp;
          {Math.round(this.props.weather.main.temp)}&deg; C / &nbsp;
          {Math.round(this.props.weather.main.temp * 9/5 + 32)}&deg; F
          <img src={iconSrc} className="weatherIcon" alt={description} />
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
