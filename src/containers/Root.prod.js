import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Route, Redirect, Switch} from 'react-router-dom';
import Paginate from './Paginate';
import ImageList from './ImageList';
import DetailDialog from './DetailDialog';
import ErrorDialog from './ErrorDialog';

const Root = ({store}) => (
  <Provider store={store}>
    <div>
      <Route path="/:index" component={Paginate} />
      <Switch>
        <Route path="/:index" component={ImageList} />
        <Redirect from="*" to="/0" />
      </Switch>
      <DetailDialog />
      <ErrorDialog />
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
