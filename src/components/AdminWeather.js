import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as slideshowConfigActions  from '../actions/actions_slideshowConfig.js';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

import {AsyncTypeahead} from 'react-bootstrap-typeahead'; // ES2015
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';


class AdminWeather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      caseSensitive: false,
      city: '',
      options: [],
      placeholder: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
  } // constructor

  onInputChange(query) {
    this.setState({isLoading: true});

    $.ajax({
      url:  `${API_ROOT}/php/weather/sqliteSearchForName.php?name=${query}`,
      type: 'GET',
      dataType: 'json'
    })
    .done((response) => {
      if (response) {
        this.setState({
          isLoading: false,
          options: response.map(item => {
            // Typeahead filters by label. Make a label with city and country name
            const label = `${item.NAME}, ${item.COUNTRY}`;
            return {...item, label }
          })
        });
      } else {
        this.setState({
          isLoading: false
        })
      }
    })
    .fail((e) => {
      console.log(e);
    }) // ajax
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.config.cityToShowWeatherFor) {
      const { NAME, COUNTRY } = JSON.parse(nextprops.config.cityToShowWeatherFor)[0];
      if (NAME && COUNTRY) {
        this.setState({placeholder: `Showing weather for: ${NAME}, ${COUNTRY}`});
      }
    // No nextprops.config.cityToShowWeatherFor
    } else {
      this.setState({placeholder: 'Search for a city to show weather for'});
    };
  }

  render() {
    return (
      <div>
        <AsyncTypeahead
          isLoading={this.state.isLoading}
          id="city"
          placeholder={this.state.placeholder}
          onSearch={query => this.onInputChange(query)}
          onChange={city => this.props.actions.setWeatherCity(city)}
          options={this.state.options}
        />
      </div>
    )

  }; // render
}

function mapStateToProps({ config }) {
  return { config };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(slideshowConfigActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminWeather);
