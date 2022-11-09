import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';

import { FiArrowLeftCircle } from 'react-icons/fi';
import { DeleteOutline } from '@material-ui/icons';

export const Container = styled.div`
  margin: 0 0 70px;
`;

export const HeaderBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  h1 {
    margin-left: 15px;
  }
`;

export const Content = styled.div``;

export const ButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 50px;
  z-index: 1000;
`;

export const Button = styled(Btn)`
  margin: 20px 0 15px !important;
  background-color: #00a65a !important;
  color: #fff !important;
`;

export const StyledIcon = styled(FiArrowLeftCircle)`
  width: 30px;
  height: 30px;
  margin-bottom: 7px;
`;

export const DeleteIcon = styled(DeleteOutline)`
  display: table-cell;
  vertical-align: middle;
`;
