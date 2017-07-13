import React from 'react';
import {render} from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTpEventPlugin from 'react-tap-event-plugin';
import Root from './Root';

import 'babel-polyfill';
// import 'animate.css';
import 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import 'ionicons/dist/css/ionicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
//
import './vendors/css/morris/morris.css';
import './vendors/css/jvectormap/jquery-jvectormap-1.2.2.css';
import './vendors/css/datepicker/datepicker3.css';
import './vendors/css/director-style.css';

import './vendors/js/jquery-ui-1.10.3.min.js';
import './vendors/js/plugins/fullcalendar/fullcalendar.js';
import './style/highlight/darkula.css';

import './style/index.style.scss';


const ELEMENT_TO_BOOTSTRAP  = 'root';
const BootstrapedElement    = document.getElementById(ELEMENT_TO_BOOTSTRAP);

injectTpEventPlugin();


const renderApp = RootComponent => {
  render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    BootstrapedElement
  );
};

renderApp(Root);

if (module.hot) {
  module.hot.accept(
    './Root',
    () => {
      const RootComponent = require('./Root').default;
      renderApp(RootComponent);
    }
  );
}
