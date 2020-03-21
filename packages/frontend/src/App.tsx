import * as React from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';

import Environment from './services/relay/Environment';
import { AppQuery } from './__generated__/AppQuery.graphql';

const helloQuery = graphql`
  query AppQuery {
    hello
  }
`;

function App() {
  return (
    <QueryRenderer<AppQuery>
      query={helloQuery}
      environment={Environment}
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
  );
}

export default App;
