import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormProject from '../Form';

interface Customer {
  customerId: number;
  name: string;
}

interface SelectProps {
  value: number;
  label: string;
}

interface Project {
  name: string;
  customerId: number;
  customerName: string;
  startYear: string;
}

const CreateProject: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { state } = useLocation<Customer>();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: Project) => {
      try {
        formRef.current?.setErrors({});

        const selectValue =
          formRef.current?.getFieldRef('customerId').select.state.selectValue;
        const customerName = selectValue.length > 0 ? selectValue[0].label : '';

        const industry: SelectProps =
          formRef.current?.getFieldRef('industry').select?.state
            ?.selectValue[0];

        const sector =
          formRef.current?.getFieldRef('sector').select?.state?.selectValue[0];

        const asset =
          formRef.current?.getFieldRef('asset').select?.state?.selectValue[0];

        const revenue =
          formRef.current?.getFieldRef('revenue').select?.state?.selectValue[0];

        const employee =
          formRef.current?.getFieldRef('employee').select?.state
            ?.selectValue[0];

        const project = {
          ...data,
          customerName,
          industry,
          sector,
          asset,
          revenue,
          employee,
        };

        const schema = Yup.object().shape({
          customerId: Yup.number().required('Customer ID is required'),
          customerName: Yup.string().required('Customer Name is required'),
          name: Yup.string().required('Project name is required'),
          // startYear: Yup.string().required('Start year is required'),
        });

        await schema.validate(project, {
          abortEarly: false,
        });

        const response = await api.post('/projects', project);

        history.push({
          pathname: `/projects/${response.data.projectId}/dashboard`,
          state: { project: response.data },
        });

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The project was created successfully!',
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
            'An error occurred while creating project, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <h1>New Project</h1>

      <FormProject
        formRef={formRef}
        handleSubmit={handleSubmit}
        buttonText="Create"
        customerData={state}
      />
    </>
  );
};

export default CreateProject;
