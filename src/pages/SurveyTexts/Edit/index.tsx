import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormSurveyText from '../Form';

interface SurveyText {
  title: string;
  text: string;
  isStartText: boolean;
}

interface ParamTypes {
  id: string;
}

const EditSurveyText: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { id } = useParams<ParamTypes>();
  const [surveyText, setSurveyText] = useState<SurveyText>();
  const history = useHistory();

  useEffect(() => {
    api.get(`/surveyTexts/${id}`).then(response => {
      setSurveyText(response.data);
    });
  }, [id]);

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

        await api.put(`/surveyTexts/${id}`, data);

        const redirectUrl =
          surveyText?.isStartText === true
            ? '/surveyTexts/type/start'
            : '/surveyTexts/type/final';

        history.push(redirectUrl);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The text was saved successfully!',
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
            'An error occurred while editing the text, please try again.',
        });
      }
    },
    [addToast, id, history, surveyText?.isStartText],
  );

  return (
    <>
      <h1>Edit {surveyText?.isStartText === true ? 'Start' : 'Final'} Text</h1>

      <FormSurveyText
        formRef={formRef}
        handleSubmit={handleSubmit}
        initialData={surveyText}
        buttonText="Save"
      />
    </>
  );
};

export default EditSurveyText;
