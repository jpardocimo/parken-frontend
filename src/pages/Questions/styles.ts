import styled from 'styled-components';
import { Button as Btn, TextField as Input } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { EditOutlined } from '@material-ui/icons';

export const Container = styled.div`
  margin: 0 0 70px;
`;

export const Content = styled.div``;

export const StyledTooltip = styled(Tooltip)`
  & .MuiTooltip-tooltip {
    background: navy;
  }
`;

export const EditIcon = styled(EditOutlined)`
  display: table-cell;
  vertical-align: middle;
`;

export const InputFilterStyled = styled(Input)`
  height: 50%;
  display: 'flex';
  position: relative;
  flex: 1;
  align-content: 'left';
  background-color: transparent;
  border-radius: 2px;
`;

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
