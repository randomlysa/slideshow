import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './helpers/store.js';
import MyRoutes from './routers/MyRoutes';
import './index.css';

const renderApp = Component => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MyRoutes />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

renderApp(MyRoutes);

if (module.hot) {
  module.hot.accept('./routers/MyRoutes', () => {
    const newRoutes = require('./routers/MyRoutes').default;
    renderApp(newRoutes);
  });
}
