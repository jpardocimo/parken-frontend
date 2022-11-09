import styled, { css } from 'styled-components';
import ReactSelect from 'react-select';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 4px;
  border: 2px solid #ccc;
  padding: 5.5px 16px;
  width: 100%;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #107fc9;
    `}
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

  img {
    max-width: 40px;
    max-height: 40px;
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
