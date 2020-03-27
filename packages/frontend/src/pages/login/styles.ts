import styled from 'styled-components';
import { Field, ErrorMessage } from 'formik';

export const Background = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #7d40e7;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-content: stretch;
  padding: 60px 30px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px #00000033;
  border-radius: 4px;
  opacity: 1;
`;

export const Title = styled.div`
  display: flex;
  text-align: left;
  letter-spacing: 0;
  color: #444444;
  opacity: 1;
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
`;

export const Input = styled(Field)`
  display: flex;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #dddddd;
  border-radius: 4px;
  opacity: 1;
  height: 45px;
  margin-top: 9px;
  padding-left: 15px;
  width: 245px;
  margin-right: 0;
`;

export const Button = styled.button`
  display: flex;
  background: #7d40e7 0% 0% no-repeat padding-box;
  border: 0px;
  border-radius: 4px;
  opacity: 1;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  letter-spacing: 0;
  color: #ffffff;
  opacity: 1;
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
  width: 100%;
  justify-content: center;
`;

export const Logo = styled.img`
  height: 44px;
  color: #7d40e7;
`;

export const ErrorText = styled(ErrorMessage)`
  color: rgb(255, 0, 0);
`;
