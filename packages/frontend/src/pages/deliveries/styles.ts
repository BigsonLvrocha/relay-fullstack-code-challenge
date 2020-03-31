import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 0 120px;
  height: fit-content;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #444444;
  padding-top: 34px;
`;

export const ActionRow = styled.h1`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 34px;
`;

export const SearchBox = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid #dddddd;
  border-radius: 4px;
`;

export const SearchIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: #999999;
`;

export const SearchText = styled.input`
  background-color: #fff;
  color: #444444;
  font-size: 14px;
  margin-left: 8px;
`;

export const AddButton = styled.button`
  background-color: #7d40e7;
  border: none;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  padding-left: 21px;
  padding-top: 11px;
  padding-bottom: 9px;
  align-items: center;
  color: #fff;
`;

export const AddText = styled.span`
  font-size: 14px;
`;

export const AddIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin-right: 7px;
`;

export const ListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  td,
  th {
    text-align: left;
    padding: 18px 0px 14px 25px;
    border: none;
  }

  td {
    color: #666666;
    font-size: 16px;
  }

  td:first-child {
    border-radius: 4px 0 0 4px;
  }

  td:last-child {
    border-radius: 0 4px 4px 0;
  }

  tr.spacing {
    background-color: #f5f5f5;
    height: 20px;
  }

  tr {
    background-color: white;
    margin-bottom: 20px;
    border-radius: 20px;
  }

  tr.header {
    background-color: #f5f5f5;
  }
`;
