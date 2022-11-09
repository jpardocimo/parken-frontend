import React, { useState } from 'react';
import { Label, Input, Indicator } from './styles';

interface props {
  value: any;
  onChange: any;
  name: string;
  id: string;
  label: string;
  disabled: boolean;
  checked: boolean;
}

const SelectorButtonElement: React.FC<props> = ({
  value,
  onChange,
  name,
  id,
  label,
  disabled,
  checked,
}) => {
  return (
    <>
      <Label htmlFor={id} disabled={disabled}>
        {label}
        <Input
          id={id}
          type="radio"
          role="radio"
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          checked={checked}
        />
        <Indicator />
      </Label>
    </>
  );
};

export default SelectorButtonElement;
