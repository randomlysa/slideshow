import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  // Schedule updateSlideshow to run every x seconds.
  updateSlideshowTimer = () => {
    window.setInterval(this.updateSlideshow, 3000);
  }

  // Get list of files, update state.
  updateSlideshow = () => {
    const self = this;

    axios.get('http://localhost/slideshow/public/php/getFiles.php')
    .then((data) => {
      let newItems = Object.values(data.data);
      self.setState({
        slideshowItems: newItems
      });
    })
    .catch((e) => {
      console.log(e);
    });
  } // updateSlideShow

  componentDidMount() {
    this.updateSlideshowTimer();

    this.setState({
      slideshowItems: this.updateSlideshow()
    });
  } // componentDidMount

  renderSlideshowItem(item) {
    const itemUrl = `bb1/${item}`;

    return (
      <img src={itemUrl} key={itemUrl}  />
    )
  } // renderSlideShow

  render() {
    if (this.state && this.state.slideshowItems) {
      return (
        <div>
          {this.state.slideshowItems.map(function(item) {
            return this.renderSlideshowItem(item)
            }, this)
          }
        </div>
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }; // render

} // class App

export default App;
