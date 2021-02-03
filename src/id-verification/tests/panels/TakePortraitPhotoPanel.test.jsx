import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import {
  render, cleanup, act, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import IdVerificationContext from '../../IdVerificationContext';
import TakePortraitPhotoPanel from '../../panels/TakePortraitPhotoPanel';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../../Camera');

const history = createMemoryHistory();

const IntlTakePortraitPhotoPanel = injectIntl(TakePortraitPhotoPanel);

describe('TakePortraitPhotoPanel', () => {
  const defaultProps = {
    intl: {},
  };

  const contextValue = {
    facePhotoFile: null,
    setFacePhotoFile: jest.fn(),
  };

  afterEach(() => {
    cleanup();
  });

  it('doesn\'t show next button before photo is taken', async () => {
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlTakePortraitPhotoPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).not.toBeVisible();
  });

  it('shows next button after photo is taken and routes to IdContextPanel', async () => {
    contextValue.facePhotoFile = 'test.jpg';
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlTakePortraitPhotoPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    expect(button).toBeVisible();
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/id-context');
  });

  it('routes back to SummaryPanel if that was the source', async () => {
    contextValue.facePhotoFile = 'test.jpg';
    history.location.state = { fromSummary: true };
    await act(async () => render((
      <Router history={history}>
        <IntlProvider locale="en">
          <IdVerificationContext.Provider value={contextValue}>
            <IntlTakePortraitPhotoPanel {...defaultProps} />
          </IdVerificationContext.Provider>
        </IntlProvider>
      </Router>
    )));
    const button = await screen.findByTestId('next-button');
    fireEvent.click(button);
    expect(history.location.pathname).toEqual('/summary');
  });
});
