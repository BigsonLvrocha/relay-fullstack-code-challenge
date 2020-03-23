import * as React from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';

import { useRelayEnv } from './store/relayEnv';
import { AppQuery } from './__generated__/AppQuery.graphql';

const helloQuery = graphql`
  query AppQuery {
    hello
  }
`;

function App() {
  const environment = useRelayEnv();
  return (
    <>
      <QueryRenderer<AppQuery>
        query={helloQuery}
        environment={environment}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>ERROR</div>;
          }
          if (props) {
            return <div>{props.hello}</div>;
          }
          return <div>loading...</div>;
        }}
      />
    </>
  );
}

export default App;
