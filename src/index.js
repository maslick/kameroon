import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './sw/serviceWorker';
import {store as storeToolkit} from './reducers/storeToolkit';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Config from "./config";
import {Provider} from "react-redux";


const RootEl = () => (
  <Provider store={storeToolkit}>
    <Router>
      <Switch>
        <Route path="/config">
          <Config/>
        </Route>
        <Route path="/">
          <App/>
        </Route>
      </Switch>
    </Router>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(RootEl());

reportWebVitals();
serviceWorker.register();