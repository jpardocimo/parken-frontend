import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormAccess from '../Form';
import BackButton from '../../../components/BackButton';

interface Access {
  name: string;
  segments: string[];
  isLocked: boolean;
  placeholders: any;
}

interface Result {
  resultId: number;
  code: string;
}

interface ParamTypes {
  surveyId: string;
}

const CreateAccess: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { surveyId } = useParams<ParamTypes>();
  const { addToast } = useToast();
  const history = useHistory();
  const [surveyIsTemplate, setSurveyIsTemplate] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const responseGetSurvey = await api.get(`/surveys/${surveyId}`);
      if (responseGetSurvey.data) {
        setSurveyIsTemplate(responseGetSurvey.data.isTemplate);
      }
    }
    fetchData().catch(console.error);
  }, [surveyId]);
  const handleSubmit = useCallback(
    async (data: Access) => {
      try {
        formRef.current?.setErrors({});

        const placeholdersParse = JSON.parse(data.placeholders);

        const access = {
          ...data,
          surveyId,
          isLocked: !!surveyIsTemplate,
          placeholders: placeholdersParse,
        };

        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          surveyId: Yup.number().required('The survey id is required'),
          segments: Yup.array(),
        });

        await schema.validate(access, {
          abortEarly: false,
        });

        await api.post('/accesses', access);

        history.push(`/surveys/${surveyId}/accesses`);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The access was created successfully!',
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
            'An error occurred while creating the access, please try again.',
        });
      }
    },
    [addToast, history, surveyId, surveyIsTemplate],
  );

  const handleRemoveCode = useCallback(async (row: Result) => {}, []);

  return (
    <>
      <BackButton />

      <h1>New Link</h1>

      <FormAccess
        formRef={formRef}
        handleSubmit={handleSubmit}
        handleRemoveCode={handleRemoveCode}
        buttonText="Create"
        isTemplate={surveyIsTemplate}
      />
    </>
  );
};

export default CreateAccess;
