import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  marginRight?: string;
  shadow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  width,
  height,
  marginRight,
  ...rest
}) => (
  <Container
    type="button"
    width={width}
    height={height}
    marginRight={marginRight}
    {...rest}
  >
    {children}
  </Container>
);

export default Button;
