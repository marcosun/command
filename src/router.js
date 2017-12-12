/**
 * This module specifies routes of this app
 * @module App/Router
 * @requires react
 * @requires react-router-dom
 * @requires loadable-components
 * @requires {@link module:Speed}
 */
import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import loadable from 'loadable-components';

// Require Pages
const Speed = loadable(() => import('./Speed/container'));

/**
 * @return {Router}
 */
export default function Router() {
  return (
    <div>
      <Route exact path="/" render={() => (
        <Redirect to="/speed"/>
      )} />
      <Route exact path="/speed" component={Speed} />
    </div>
  );
}
