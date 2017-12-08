import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Slideshow from './components/Slideshow';
import Admin from './components/Admin';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Slideshow} />
          <Route exact path="/admin" component={Admin} />
        </div>
      </Router>
    )
  }
} // App

export default App;
