import { combineReducers } from 'redux';

import SlideshowReducer from './reducer_slideshow';
import SlideshowConfigReducer from './reducer_slideshowConfig';
import AdminReducer from './reducer_admin';
import WeatherReducer from './reducer_weather';
import CSVReducer from './reducer_csv';

const slideshowApp = combineReducers({
  slideshowItems: SlideshowReducer,
  config: SlideshowConfigReducer,
  weather: WeatherReducer,
  admin: AdminReducer,
  csvItems: CSVReducer
});

export default slideshowApp;
