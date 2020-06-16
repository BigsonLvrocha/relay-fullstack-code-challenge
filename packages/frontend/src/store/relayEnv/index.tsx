import * as React from 'react';
import environment from '../../services/relay/Environment';

const RelayEnvContext = React.createContext(environment);

export const RelayEnvProvider: React.FunctionComponent = ({ children }) => {
  return (
    <RelayEnvContext.Provider value={environment}>
      {children}
    </RelayEnvContext.Provider>
  );
};

export function useRelayEnv() {
  const env = React.useContext(RelayEnvContext);
  return env;
}
