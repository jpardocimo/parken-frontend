import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';

import EnumQuestionType from '../../../utils/enums/EnumQuestionType';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormQuestion from '../Form';

interface Question {
  text: string;
  type: string;
  alternatives: Alternative[];
  options: Option[];
  tags: Tag[];
}

interface Alternative {
  value: number;
  text: string;
}

interface Option {
  value: number;
  text: string;
}

interface Tag {
  value: string;
  label: string;
}

const CreateQuestion: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: Question) => {
      try {
        formRef.current?.setErrors({});

        const showOptions = data.type !== EnumQuestionType.Text;

        const schema = Yup.object().shape({
          text: Yup.string().required('Question text is required'),
          type: Yup.string().required('Question type is required'),
          options: showOptions
            ? Yup.array().required('The question options are required')
            : Yup.array(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/questions', data);

        history.push('/questions');

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The question was created successfully!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'An error occurred while creating question, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <h1>New Question</h1>

      <FormQuestion
        formRef={formRef}
        handleSubmit={handleSubmit}
        buttonText="Create"
      ></FormQuestion>
    </>
  );
};

export default CreateQuestion;
