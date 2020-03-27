// / <reference types="react-scripts" />
declare module 'babel-plugin-relay/macro' {
  export { graphql } from 'react-relay';
}
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const value: any;
  export default value;
}
