import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { EditOutlined, Add } from '@material-ui/icons';

export const Container = styled.div``;

export const Content = styled.div`
  a {
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.6;
    }
  }

  svg {
    display: table-cell;
    vertical-align: middle;
  }
`;

export const Button = styled(Btn)`
  margin: 20px 40px 15px 0 !important;
  width: 200px;
  background-color: #00a65a !important;
  color: #fff !important;
`;

export const StyledTooltip = styled(Tooltip)`
  & .MuiTooltip-tooltip {
    background: navy;
  }
`;

export const EditIcon = styled(EditOutlined)`
  display: table-cell;
  vertical-align: middle;
`;

export const Placeholder = styled.div`
  background-color: #f1f0f0;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem 1rem 1rem;
  border-radius: 4px;

  h2 {
    margin: 10px;
  }

  && button {
    background-color: #f1f0f0;
    border: 0;
    margin: 0;
    padding: 0;
  }

  && th {
    width: 205px;
  }
`;

export const AddIcon = styled(Add)`
  display: table-cell;
  vertical-align: middle;
`;

export const Hr = styled.hr`
  width: 215%;
  text-align: left;
  margin-left: 0;
  border-top: 2px solid #ccc;
`;
