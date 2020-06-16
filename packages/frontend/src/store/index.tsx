import * as React from 'react';

import { RelayEnvProvider } from './relayEnv';
import { MeStoreProvider } from './me';

export const StoreProviders: React.FunctionComponent = ({ children }) => (
  <MeStoreProvider>
    <RelayEnvProvider>{children}</RelayEnvProvider>
  </MeStoreProvider>
);
