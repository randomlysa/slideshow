import { combineReducers } from 'redux';

import SlideshowReducer from './reducer_slideshow';
import SlideshowConfigReducer from './reducer_slideshowconfig';
import AdminReducer from '../components/Admin/reducer_admin';
import WeatherReducer from './reducer_weather';
import CSVReducer from './reducer_csv';

const slideshowApp = combineReducers({
  slideshowItems: SlideshowReducer,
  config: SlideshowConfigReducer,
  weather: WeatherReducer,
  admin: AdminReducer,
  csv: CSVReducer
});

export default slideshowApp;
