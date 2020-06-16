import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { useMeStore } from '../../store/me';
import logo from '../../assets/fastfeet-logo.png';

import { Deliveries } from '../deliveries';
import { DeliveryMans } from '../delivery-mans';
import { Problems } from '../problems';
import { Recipients } from '../recipients';

import {
  NavBarContainer,
  LeftNavBarContainer,
  ImageContainer,
  LinksContainer,
  RouterLink,
  AcountActionContainer,
  LogoutAction,
  UserName,
} from './styles';

export const App: React.FunctionComponent = () => {
  const { state, actions } = useMeStore();
  return (
    <>
      <NavBarContainer>
        <LeftNavBarContainer>
          <ImageContainer src={logo} />
          <LinksContainer>
            <RouterLink to="/app/deliveries" activeClassName="active">
              Encomendas
            </RouterLink>
            <RouterLink to="/app/delivery-mans" activeClassName="active">
              Entregadores
            </RouterLink>
            <RouterLink to="/app/recipients" activeClassName="active">
              Destinatários
            </RouterLink>
            <RouterLink to="/app/problems" activeClassName="active">
              Problemas
            </RouterLink>
          </LinksContainer>
        </LeftNavBarContainer>
        <AcountActionContainer>
          <UserName>{state.me?.name}</UserName>
          <LogoutAction onClick={() => actions.logout()}>
            Sair da aplicação
          </LogoutAction>
        </AcountActionContainer>
      </NavBarContainer>
      <Switch>
        <Route path="/app/deliveries" exact>
          <Deliveries />
        </Route>
        <Route path="/app/delivery-mans" exact>
          <DeliveryMans />
        </Route>
        <Route path="/app/problems" exact>
          <Problems />
        </Route>
        <Route path="/app/recipients" exact>
          <Recipients />
        </Route>
      </Switch>
    </>
  );
};
