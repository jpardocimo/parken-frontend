import styled from 'styled-components';
import ReactSelect from 'react-select';

import Tooltip from '../Tooltip';

export const Container = styled.div`.
    flex: 1;
    border: 0;
    box-shadow: none;
    padding: 0;
    margin: 0;

`;

export const CustomSelect = styled(ReactSelect)`
  flex: 1;

  .${props => props.classNamePrefix}__control {
    border: 0;
    box-shadow: none;
  }

  .${props => props.classNamePrefix}__value-container {
    padding: 0;
  }

  .${props => props.classNamePrefix}__placeholder {
    margin: 0;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
