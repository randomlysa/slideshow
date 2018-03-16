import { combineReducers } from 'redux';

import SlideshowReducer from './reducer_slideshow';
import SlideshowConfigReducer from './reducer_slideshowconfig';
import AdminReducer from './reducer_admin';
import WeatherReducer from './reducer_weather';

const slideshowApp = combineReducers({
  slideshowItems: SlideshowReducer,
  config: SlideshowConfigReducer,
  weather: WeatherReducer,
  admin: AdminReducer
});

export default slideshowApp;
