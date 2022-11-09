/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { OptionTypeBase, Props as SelectProps } from 'react-select';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, CustomSelect, Error } from './styles';

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
  isMulti?: any;
}

const Select: React.FC<Props> = ({ name, ...rest }: Props) => {
  const selectRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) return [];

          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }

        if (!ref.state.value) return '';

        return ref.state.value.value;
      },
      setValue: (ref: any, value: any) => {
        ref.select.setValue(value);
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container isErrored={!!error} isFocused={isFocused}>
      <CustomSelect
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
