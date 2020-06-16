import * as React from 'react';
import { render } from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import App from './App';
import { StoreProviders } from './store';

render(
  <StoreProviders>
    <App />
  </StoreProviders>,
  document.getElementById('root'),
);
