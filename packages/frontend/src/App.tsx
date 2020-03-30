import * as React from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import {
  createRefetchContainer,
  QueryRenderer,
  RelayRefetchProp,
} from 'react-relay';

import { getAuthToken, setAuthToken } from './services/session';
import { useRelayEnv } from './store/relayEnv';
import { Router } from './router';
import { AppQuery } from './__generated__/AppQuery.graphql';
import { App_me } from './__generated__/App_me.graphql';

const AppMainQuery = graphql`
  query AppQuery {
    ...App_me
  }
`;

const MeCtx = React.createContext({
  me: null as App_me | null,
  refetchMe: ((() => {}) as unknown) as RelayRefetchProp['refetch'],
});

const App: React.FunctionComponent<{
  me: App_me | null;
  relay: RelayRefetchProp;
}> = ({ me, relay }) => {
  return (
    <MeCtx.Provider value={{ me, refetchMe: relay.refetch }}>
      <Router />
    </MeCtx.Provider>
  );
};

const AppWithRefetch = createRefetchContainer(
  App,
  {
    me: graphql`
      fragment App_me on Query {
        me {
          id
          name
          email
        }
      }
    `,
  },
  AppMainQuery,
);

const AppWithMainQuery: React.FunctionComponent = () => {
  const tokenInSession = getAuthToken();
  const env = useRelayEnv();
  return (
    <QueryRenderer<AppQuery>
      query={tokenInSession ? AppMainQuery : undefined}
      environment={env}
      variables={{}}
      render={({ error, props }) => {
        if (error && error.message === 'Not Authorized') {
          setAuthToken(null);
        }
        return <AppWithRefetch me={props} />;
      }}
    />
  );
};

export default AppWithMainQuery;
