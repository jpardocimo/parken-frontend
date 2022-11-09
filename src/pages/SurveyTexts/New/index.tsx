import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormSurveyText from '../Form';

interface SurveyText {
  title: string;
  text: string;
}

interface State {
  isStartText: boolean;
}

const CreateSurveyText: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { state } = useLocation<State>();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SurveyText) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('The title is required'),
          text: Yup.string().required('The text required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/surveyTexts', {
          ...data,
          isStartText: state.isStartText,
        });

        const redirectUrl =
          state.isStartText === true
            ? '/surveyTexts/type/start'
            : '/surveyTexts/type/final';

        history.push(redirectUrl);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The text was created successfully!',
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
            'An error occurred while creating the text, please try again.',
        });
      }
    },
    [addToast, history, state.isStartText],
  );

  return (
    <>
      <h1>New {state.isStartText === true ? 'Start' : 'Final'} Text</h1>

      <FormSurveyText
        formRef={formRef}
        handleSubmit={handleSubmit}
        buttonText="Create"
      />
    </>
  );
};

export default CreateSurveyText;
