/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import { useField } from '@unform/core';
import { TiDelete } from 'react-icons/ti';

import {
  Container,
  Content,
  Break,
  ValueLabel,
  DeleteButton,
  AddButton,
  Input,
} from './styles';

interface Props {
  name: string;
  filledOptions?: Option[];
  width?: string;
  disabled?: boolean;
}

interface Option {
  value: number;
  text: string;
  disabled?: boolean;
}

const MultiInput: React.FC<Props> = ({
  name,
  width,
  filledOptions,
  disabled = false,
}) => {
  const [options, setOptions] = useState<Option[]>(() => {
    if (filledOptions) return filledOptions;
    return [{ value: 1, text: '' }];
  });
  const { fieldName, error, registerField } = useField(name);

  const handleInputOptionChange = useCallback(
    (index: number, value: string): void => {
      const optionList = [...options];
      optionList[index].text = value;
      setOptions(optionList);
    },
    [options],
  );

  const handleRemoveOption = useCallback(
    (index: number): void => {
      const optionList = [...options];
      optionList.splice(index, 1);
      setOptions(optionList);
    },
    [options],
  );

  const handleAddOption = useCallback((): void => {
    setOptions([
      ...options,
      {
        value: options.length + 1,
        text: '',
      },
    ]);
  }, [options]);

  useEffect(() => {
    if (filledOptions)
      setOptions(
        disabled
          ? filledOptions.map(opt => {
              opt.disabled = disabled;
              return opt;
            })
          : filledOptions,
      );
  }, [filledOptions, disabled]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: options,
      getValue: (opt: Option[]) => {
        const allOptionsAreEmpty = options.every(option => option.text === '');

        if (allOptionsAreEmpty) return undefined;

        return options.filter(option => {
          return option.text.trim() !== '';
        });
      },
    });
  }, [fieldName, registerField, options]);

  return (
    <Container width={width}>
      {options.map((option, index) => (
        <Content key={index}>
          <ValueLabel>{option.value}</ValueLabel>

          <Input
            type="text"
            value={option.text}
            isErrored={!!error}
            disabled={option.disabled}
            onChange={event =>
              handleInputOptionChange(index, event.target.value)
            }
          />

          {options.length - 1 === index && (
            <>
              {!option.disabled && options.length > 1 && (
                <DeleteButton>
                  <TiDelete
                    color="#00B698"
                    size={30}
                    onClick={() => handleRemoveOption(index)}
                  />
                </DeleteButton>
              )}
              <>
                <Break />
                <AddButton onClick={handleAddOption}>Add New</AddButton>
              </>
            </>
          )}
        </Content>
      ))}
    </Container>
  );
};

export default MultiInput;
