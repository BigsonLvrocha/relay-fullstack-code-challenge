import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const NavBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  border: 1px solid #dddddd;
`;

export const LeftNavBarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ImageContainer = styled.img`
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 30px;
  border-right: 1px solid #dddddd;
  height: 26px;
  width: 135px;
`;

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 30px;
`;

export const RouterLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 20px;
  font-size: 15px;
  text-decoration: none;
  color: #999999;
  &.active {
    color: #444444;
  }
`;

export const AcountActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 6px;
  align-items: flex-end;
`;

export const UserName = styled.span`
  font-size: 14px;
  text-align: right;
  color: #666666;
`;

export const LogoutAction = styled.button`
  margin-top: 5px;
  text-align: right;
  color: #de3b3b;
  font-size: 14px;
  background-color: #ffff;
  margin-bottom: 15px;
`;
