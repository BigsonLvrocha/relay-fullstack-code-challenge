import * as React from 'react';
import { useMeStore } from './store/me';
import { Router } from './router';

function App() {
  const { state } = useMeStore();
  return state.checked ? <Router /> : <div>loading...</div>;
}

export default App;
