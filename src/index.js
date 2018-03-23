import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './helpers/store.js';
import MyRoutes from './routers/MyRoutes';
import './index.css';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MyRoutes />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
