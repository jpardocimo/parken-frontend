import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ButtonProps {
  width?: string;
  height?: string;
  marginRight?: string;
  shadow?: boolean;
}

export const Container = styled.button<ButtonProps>`
  background: #ff9000;
  //height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '56px')};
  font-weight: 500;
  margin-top: 16px;
  margin-right: ${props => (props.marginRight ? props.marginRight : '0')};
  transition: background-color 0.2s;
  box-shadow: ${props =>
    props.shadow ? '0px 8px 15px rgb(0 0 0 / 10%)' : 'none'};

  ${props =>
    props.disabled &&
    css`
      background: ${shade(0.2, '#ff9000')};
      border: 1px solid #9e5d08;
      background-color: #9e5d08;
      color: #b7b7b7;
      padding: 5px 10px;
    `}

  ${props =>
    !props.disabled &&
    css`
      &:hover {
        background: ${shade(0.2, '#ff9000')};
      }
    `}
`;

export default Container;
