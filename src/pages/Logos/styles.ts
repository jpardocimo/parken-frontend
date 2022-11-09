import styled from 'styled-components';

import { EditOutlined, DeleteOutline, Filter } from '@material-ui/icons';

import Tooltip from '@material-ui/core/Tooltip';

export const Container = styled.div``;

export const Content = styled.div`
  margin-top: 30px;

  img {
    max-width: 180px;
    max-height: 100%;
  }
`;

export const ButtonUpload = styled.div`
  background: #ff9000;
  border-radius: 7px;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
  padding: 8px 16px;
  height: 40px;
  width: 200px;
  color: #312e38;
  display: inline-block;

  label {
    font-weight: 500;
    cursor: pointer;

    input {
      display: none;
    }
  }
`;

export const EditIcon = styled(EditOutlined)`
  display: table-cell;
  vertical-align: middle;
`;

export const UrlCopy = styled(Filter)`
  display: table-cell;
  vertical-align: middle;
`;

export const DeleteIcon = styled(DeleteOutline)`
  display: table-cell;
  vertical-align: middle;
`;

export const StyledTooltip = styled(Tooltip)`
  & .MuiTooltip-tooltip {
    background: navy;
  }
`;
