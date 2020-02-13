import 'babel-polyfill';
import 'formdata-polyfill';
import { AppProvider, ErrorPage, AuthenticatedPageRoute } from '@edx/frontend-platform/react';
import { subscribe, initialize, APP_INIT_ERROR, APP_READY, mergeConfig } from '@edx/frontend-platform';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import configureStore from './data/configureStore';
import AccountSettingsPage, { NotFoundPage } from './account-settings';
import LoginPage from './registration/LoginPage';
import RegistrationPage from './registration/RegistrationPage';
import appMessages from './i18n';

import './index.scss';
import './assets/favicon.ico';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Header />
      <main>
        <Switch>
          <AuthenticatedPageRoute exact path="/" component={AccountSettingsPage} />
          <Route path="/notfound" component={NotFoundPage} />
          {
            getConfig().ENABLE_LOGIN_AND_REGISTRATION && <>
              <Route path="/login" component={LoginPage} />
              <Route path="/registration" component={RegistrationPage} />
            </>
          }
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        SUPPORT_URL: process.env.SUPPORT_URL,
        ENABLE_LOGIN_AND_REGISTRATION: process.env.ENABLE_LOGIN_AND_REGISTRATION,
      }, 'App loadConfig override handler');
    },
  },
});
