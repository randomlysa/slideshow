import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWeatherFromOpenWeather } from '../actions/weather';

class Weather extends Component {
  componentWillMount() {
        this.props.fetchWeatherFromOpenWeather();
  }

  render() {
    return (
      <h1 className="weather">{this.props.weather.main.temp}&deg; F</h1>
    )
  }
}

function mapStateToProps({ weather }) {
  return { weather } ;
}

function mapDispatchToProps(dispatch) {
  // Assign all actions (import * as actionCreators) to props.actions
  return bindActionCreators( {fetchWeatherFromOpenWeather }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Weather);
