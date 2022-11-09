import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormLogo from '../Form';

interface Logo {
  name: string;
  url: string;
  imageType: string;
  isActive: boolean;
}

const CreateLogo: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  // const { state } = useLocation<State>();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: Logo) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          url: Yup.string().required('The url required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/logos/', {
          ...data,
        });

        history.push(`/logos/`);

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
    [addToast, history],
  );

  return (
    <>
      <h1>New Logo</h1>

      <FormLogo
        formRef={formRef}
        handleSubmit={handleSubmit}
        buttonText="Create"
      ></FormLogo>
    </>
  );
};

export default CreateLogo;
