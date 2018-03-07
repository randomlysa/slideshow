import React, { Component } from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';

import {AsyncTypeahead} from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';


class AdminWeather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      caseSensitive: false,
      city: '',
      options: []
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
      this.setState({
        isLoading: false,
        options: response
      })
    })
    .fail((e) => {
      console.log(e);
    }) // ajax
  }

  render() {
    return (
      <div>
        <AsyncTypeahead
          labelKey="NAME"
          isLoading={this.state.isLoading}
          id="city"
          placeholder="City name"
          onSearch={query => this.onInputChange(query)}

          options={this.state.options}
        />
      </div>
    )

  }; // render
}

function mapStateToProps({ slideshowItems }) {
  return { slideshowItems };
}

export default connect(mapStateToProps)(AdminWeather);
