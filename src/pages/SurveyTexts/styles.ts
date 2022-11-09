import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';
import { EditOutlined, DeleteOutline } from '@material-ui/icons';

export const Container = styled.div``;

export const Content = styled.div``;

export const Button = styled(Btn)`
  margin: 20px 0 15px !important;
  background-color: #00a65a !important;
  color: #fff !important;
`;

export const EditIcon = styled(EditOutlined)`
  display: table-cell;
  vertical-align: middle;
`;

export const DeleteIcon = styled(DeleteOutline)`
  display: table-cell;
  vertical-align: middle;
`;
