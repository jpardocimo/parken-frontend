import styled, { keyframes } from 'styled-components';

interface LabelProps {
  disabled: boolean;
}

export const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;

  border: 1px solid #eee;
  cursor: pointer;
  transition: all 175ms ease-in-out;

  &hover: {
    color: #fff;
  }

  &::after {
    margin-left: 10em;
  }
`;

const popIn = keyframes`
from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.5) ;
}
to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) ;
}
`;

export const Label = styled.label<LabelProps>`
  z-index: 1 !important;
  color: darkblue;
  position: relative;
  display: inline-block;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-left: 0.5em;

  & + & {
    margin-left: auto;
  }
  font-size: 16px;
  width: 2em;
  &hover: {
    color: #fff;
    border-color: rgba(0, 174, 255, 0.5);
    background-color: rgba(0, 174, 255, 0.5);
  }
`;

export const Indicator = styled.div`
  border: 1px solid;
  border-color: rgba(0, 174, 255, 0.5);

  z-index: -1 !important;
  border-radius: 5px;
  width: 8.4em;
  height: 2.5em;
  position: absolute;
  top: -0.5em;
  left: -0.7em;

  ${Label}:hover & {
    border-color: rgba(0, 174, 255, 0.5);
    background-color: rgba(0, 174, 255, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    display: none;
  }

  ${Input}:checked + &::after {
    display: block;
    border: solid #263238;
    border-radius: 50%;
    background-color: #263238;
    width: 1em;
    height: 1em;
    top: 50%;
    left: 85%;
    transform: translate(-50%, -50%);
    animation-name: ${popIn};
    animation-duration: 0.3s;
    animation-fill-mode: forwards;

    border-color: #00aeff;
    background-color: #00aeff;
  }
  ${Label}:hover & {
    color: #fff !important;
  }

  ${Input}:disabled + & {
    pointer-events: none;
    opacity: 0.6;
    background: #e6e6e6;
  }
`;
