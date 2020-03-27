import * as React from 'react';
import { fetchQuery } from 'react-relay';

import { getAuthToken, setAuthToken } from '../../services/session';
import Environment from '../../services/relay/Environment';

import { meQuery } from './__generated__/meQuery.graphql';
import { query } from './meQuery';

export type MeType = {
  id: string;
  name: string;
  email: string;
  token: string;
};

const initialState = {
  me: null as MeType | null,
  checked: false,
};

type CounterState = typeof initialState;
type CounterActionType =
  | { type: 'Logout' }
  | {
      type: 'Login';
      payload: {
        me: MeType;
      };
    };

const reducer: React.Reducer<CounterState, CounterActionType> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'Logout':
      return {
        ...state,
        checked: true,
        me: null,
      };
    case 'Login':
      return {
        ...state,
        checked: true,
        me: action.payload.me,
      };
    default:
      return state;
  }
};

const MeContext = React.createContext({
  state: initialState,
  dispatch: (() => {}) as React.Dispatch<CounterActionType>,
});

export const MeStoreProvider: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const token = getAuthToken();
  if (!state.checked) {
    if (token) {
      fetchQuery<meQuery>(Environment, query, {})
        .then(({ me }) => {
          dispatch({
            type: 'Login',
            payload: {
              me: {
                ...me,
                token,
              },
            },
          });
        })
        .catch((error: any) => {
          // eslint-disable-next-line no-console
          console.error(error);
          setAuthToken(null);
          dispatch({ type: 'Logout' });
        });
    } else {
      dispatch({ type: 'Logout' });
    }
  }
  return (
    <MeContext.Provider value={{ state, dispatch }}>
      {children}
    </MeContext.Provider>
  );
};

export function useMeStore() {
  const ctx = React.useContext(MeContext);
  return {
    ...ctx,
    actions: {
      login(me: MeType) {
        ctx.dispatch({ type: 'Login', payload: { me } });
      },
      logout() {
        ctx.dispatch({ type: 'Logout' });
      },
    },
  };
}
