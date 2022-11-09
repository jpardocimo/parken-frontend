import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  width?: string;
}

interface InputProps {
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: ${props => (props.width ? props.width : '360px')};
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const Input = styled.input<InputProps>`
  flex: 1;
  border: 2px solid #ccc;
  color: #333;
  padding: 5px 10px;
  font-size: 14px;

  &::placeholder {
    color: #666360;
  }

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid #c53030;
    `}
`;

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;

export const ValueLabel = styled.div`
  width: 20px;
`;

export const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const AddButton = styled.button`
  background-color: #00b698;
  color: #fff;
  border: 0;
  padding: 10px 15px;
  margin: 10px 0 0 20px;
  transition: background-color 0.2s;

  ${props =>
    !props.disabled &&
    css`
      &:hover {
        background: ${shade(0.2, '#00b698')};
      }
    `}
`;
