import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';

export const Container = styled.div``;

export const Content = styled.div``;

export const Button = styled(Btn)`
  margin: 20px 0 15px !important;
  background-color: #00a65a !important;
  color: #fff !important;
`;

export const BoxRow = styled.div`
  display: flex;
  align-items: center;

  &:first-child {
    margin: 20px 0 0;
    font-size: 20px;
  }
`;

export const BoxCol = styled.div`
  flex: 1;
  text-align: center;
  margin: 14px 0;
`;

export const BoxColTitle = styled.div`
  flex: 1;
  text-align: center;
  margin: 14px 0;
  padding: 12px 0;
  border-radius: 4px;
  background-color: #f6f6f6;
`;
