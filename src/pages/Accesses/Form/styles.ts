import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';

import { Add } from '@material-ui/icons';

export const Container = styled.div``;

export const ButtonMd = styled(Btn)`
  background-color: #00a65a !important;
  color: #fff !important;
  padding: 12px 0 !important;
  width: 10%;
`;

export const BoxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const IptContainer = styled.div`
  width: 90%;
  margin: 0 15px 0 0;
`;

export const PlaceholderContainer = styled.div`
  && button {
    background: #ffffff;
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
