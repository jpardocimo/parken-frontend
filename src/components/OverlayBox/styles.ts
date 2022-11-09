import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  backgroundColor?: string;
}

interface TooltipErrorProps {
  backgroundColor?: string;
  left?: string;
  right?: string;
  top?: string;
}

export const Container = styled.div<ContainerProps>`
  font-family: Roboto, sans-serif;
  background-color: rgba(247, 110, 0, 0.9);
  display: grid;
  place-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48%;
  box-shadow: 0 0 8px 0 rgb(0 0 0 / 25%);
  padding: 5px 10px;
  overflow: auto;

  ${props =>
    props.backgroundColor
      ? css`
          background-color: ${props.backgroundColor};
        `
      : css`
          //background-color: rgba(247, 110, 0, 0.9); //emotionbanking color
          background-color: rgba(178, 28, 29, 0.9);
        `}

  .c-formContainer,
  .c-form {
    width: 31em;
    height: 3.25em;

    @media (max-width: 535px) {
      width: 100%;
    }
  }

  .c-formContainer {
    position: relative;
    font-weight: 700;
  }

  .c-form {
    position: absolute;
    border-radius: 6.25em;
    background-color: #ffffff;
    transition: 0.2s;
  }

  .c-form {
    left: 50%;
    transform: translateX(-50%);
    padding: 0.4em;
    box-sizing: border-box;
    box-shadow: 0 0.125em 0.3125em rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
  }

  .c-form__input,
  .c-form__button {
    font: inherit;
    border: 0;
    outline: 0;
    border-radius: 5em;
    box-sizing: border-box;
  }

  .c-form__input {
    color: #69c6b2;
    height: 100%;
    width: 100%;
    padding: 0 0.714em;
  }

  .c-form__buttonLabel {
    color: #fff;
    height: 100%;
    width: auto;
  }

  .c-form__button__dismiss {
    font: inherit;

    box-sizing: border-box;
    color: #fff;
    padding: 0;
    height: 100%;
    width: 7em;
    background-color: #47283a;
    font-size: 15px;
    width: 254px;
    margin-left: 100px;
    border-radius: 5em;
    border-color: #fff;
    outline: 0;

    &:hover {
      opacity: 0.8;
    }
  }

  .c-form__button {
    color: #fff;
    padding: 0;
    height: 100%;
    width: 7em;
    border-radius: 5em;
    //background-color: #1ab394;
    background-color: #47283a;
    //background-color: #46373d;
    font-size: 15px;
    border-color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const WrapBox = styled.div`
  max-width: 960px;

  h3 {
    border-bottom: 1px solid #fff;
    color: #fff;
    text-align: center;
    display: table;
    padding-bottom: 14px;
    margin: 0 auto 12px;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    color: #fff;
    text-align: center;
    font-size: 16px;
  }

  input {
    margin-right: 5px;
    vertical-align: middle;
  }

  label {
    font-size: 14px;
    color: #fff;
    vertical-align: middle;
    position: relative;
  }

  a {
    margin-left: 4px;
    font-weight: bold;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  margin-right: 10px;
  margin-top: 10px;

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

export const TooltipError = styled.span<TooltipErrorProps>`
  position: relative;
  right: ${props => props.right ?? ''};
  left: ${props => props.left ?? ''};
  top: ${props => props.top ?? ''};
  width: max-content;
  background: #3a3732;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;

  transition: opacity 0.4s;

  position: absolute;
  bottom: calc(100% + 12px);

  transform: translateX(-50%);

  color: #ffff;
  border: solid 2px #f00;
  &::before {
    content: '';
    border-style: solid;
    border-color: #3a3732 transparent;
    border-width: 6px 6px 0 6px;
    top: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  li {
    padding: 5px;
  }
`;
