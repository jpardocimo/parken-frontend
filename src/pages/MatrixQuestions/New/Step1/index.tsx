import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { Container, Content, HeaderBox, StyledIcon } from './styles';
import Button from '../../../../components/Button';

import api from '../../../../services/api';
import Select from '../../../../components/SelectForm';

interface Option {
  value: number;
  label: string[];
}

interface State {
  select: boolean;
  surveyId: number;
  // survey: any;
}
const CreateMatrix: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option>();
  const { state } = useLocation<State>();
  useEffect(() => {
    api.get('questionOptions').then(response => {
      setOptions(response.data);
    });
  }, []);

  const handleSubmit = useCallback(() => {}, []);

  const handleOptionChange = useCallback(optionSelected => {
    setSelectedOption(optionSelected);
  }, []);

  return (
    <Container>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Content>
          <HeaderBox>
            <Link
              to={{
                pathname: `/matrixQuestions/`,
                state: {
                  select: state?.select,
                  surveyId: state?.surveyId,
                },
              }}
            >
              <StyledIcon />
            </Link>
            <h1>New Matrix - Options</h1>
          </HeaderBox>
          <h2>Select options group</h2>

          <Select
            name={'option'}
            value={options.map((c: Option) => {
              return {
                text: c,
              };
            })}
            options={options.map((c: Option) => {
              return {
                value: c.label,
                label: (
                  <ul>
                    {c.label.map((t: string, i: number) => {
                      return (
                        <li key={i}>
                          <span>{t}</span>
                        </li>
                      );
                    })}
                  </ul>
                ),
              };
            })}
            onChange={e => handleOptionChange(e)}
            placeholder="Select options group"
          />

          <div>{selectedOption?.label}</div>
        </Content>

        {selectedOption && (
          <Link
            to={{
              pathname: `/matrixQuestions/step2`,
              state: {
                select: state?.select,
                selectedOption: selectedOption?.value,
                surveyId: state?.surveyId,
              },
            }}
          >
            <Button type="button" width="200px">
              Continue
            </Button>
          </Link>
        )}
      </Form>
    </Container>
  );
};
export default CreateMatrix;
