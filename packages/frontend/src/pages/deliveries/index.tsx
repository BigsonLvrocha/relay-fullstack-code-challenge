import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

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

export const Deliveries = () => (
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
      <tr>
        <td>#01</td>
        <td>Bethoven</td>
        <td>John Doe</td>
        <td>São Paulo</td>
        <td>SP</td>
        <td>Entregue</td>
        <td>ponts</td>
      </tr>
      <tr className="spacing" />
      <tr>
        <td>#01</td>
        <td>Bethoven</td>
        <td>John Doe</td>
        <td>São Paulo</td>
        <td>SP</td>
        <td>Entregue</td>
        <td>ponts</td>
      </tr>
      <tr className="spacing" />
      <tr>
        <td>#01</td>
        <td>Bethoven</td>
        <td>John Doe</td>
        <td>São Paulo</td>
        <td>SP</td>
        <td>Entregue</td>
        <td>ponts</td>
      </tr>
      <tr className="spacing" />
      <tr>
        <td>#01</td>
        <td>Bethoven</td>
        <td>John Doe</td>
        <td>São Paulo</td>
        <td>SP</td>
        <td>Entregue</td>
        <td>ponts</td>
      </tr>
      <tr className="spacing" />
    </ListTable>
  </Container>
);
