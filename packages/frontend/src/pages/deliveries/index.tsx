import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { QueryRenderer } from 'react-relay';

import { useRelayEnv } from '../../store/relayEnv';

import { deliveriesQuery } from './__generated__/deliveriesQuery.graphql';

import {
  ActionRow,
  AddButton,
  AddIcon,
  AddText,
  Container,
  ListTable,
  SearchBox,
  SearchIcon,
  SearchText,
  Title,
} from './styles';
import { query } from './deliveries';

// TODO: i18n
const statusTranslation = {
  DELIVERED: 'ENTREGUE',
  PENDING: 'PENDENTE',
  DELIVERING: 'RETIRADA',
  CANCELLED: 'CANCELADA',
  '%future added value': 'DESCONHECIDO',
};

export const Deliveries = () => {
  const env = useRelayEnv();
  return (
    <QueryRenderer<deliveriesQuery>
      query={query}
      variables={{}}
      environment={env}
      render={({ error, props }) => {
        if (error) {
          return <div>Error</div>;
        }
        if (props) {
          return (
            <Container>
              <Title>Entregas</Title>
              <ActionRow>
                <SearchBox>
                  <SearchIcon icon={faSearch} />
                  <SearchText placeholder="Buscar por encomenda" />
                </SearchBox>
                <AddButton>
                  <AddIcon icon={faPlus} />
                  <AddText>CADASTRAR</AddText>
                </AddButton>
              </ActionRow>
              <ListTable>
                <tr className="header">
                  <th>ID</th>
                  <th>Destinatário</th>
                  <th>Entregador</th>
                  <th>Cidade</th>
                  <th>Estado</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
                {props.deliveries?.edges?.map(edge => (
                  <>
                    <tr>
                      <td>{edge?.node?.id}</td>
                      <td>{edge?.node?.recipient?.name}</td>
                      <td>{edge?.node?.deliveryMan?.name}</td>
                      <td>{edge?.node?.recipient?.city}</td>
                      <td>{edge?.node?.recipient?.state}</td>
                      <td>
                        {edge?.node?.status
                          ? statusTranslation[edge.node.status]
                          : 'INDISPONIVEL'}
                      </td>
                      <td>ponts</td>
                    </tr>
                    <tr className="spacing" />
                  </>
                ))}
              </ListTable>
            </Container>
          );
        }
        return <div>loading</div>;
      }}
    />
  );
};
