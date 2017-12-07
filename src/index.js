import React from 'react';
import {render} from 'react-dom';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import {HashRouter as Router} from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = configureStore();

render(
  <Router>
    <MuiThemeProvider><Root store={store} /></MuiThemeProvider>
  </Router>,
  document.getElementById('root')
);
