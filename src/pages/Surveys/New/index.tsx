import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormProjectSurvey from '../Form';

interface Accesses {
  name: string;
  placeholders: string[];
  segments: string[];
}

interface Survey {
  name: string;
  title: string;
  pages: object[];
  isTemplate: boolean;
  projectId: number;
  productId: number;
  subGroup: string;
}

interface SurveyFormData {
  name: string;
  product: number;
  project: number;
  subGroup: string;
  useTemplate: boolean;
}

interface Product {
  productId: number;
  name: string;
  userGroups: UserGroup[];
}

interface UserGroup {
  name: string;
  subGroups: SubGroup[];
  structure: object[];
}

interface SubGroup {
  name: string;
  surveyId?: number;
}

interface IState {
  projectId: string;
}

const CreateProjectSurvey: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { state } = useLocation<IState>();

  const handleSubmit = useCallback(
    async (data: SurveyFormData) => {
      try {
        formRef.current?.setErrors({});

        let pages: any = [];
        let accessesFromTemplate: Accesses[] = [];
        if (data.useTemplate) {
          const response = await api.get(`/products/${data.product}`);

          const product: Product = response.data;
          const subGroup = product?.userGroups
            .map((user: UserGroup) => {
              return user.subGroups.find(e => e.name === data.subGroup);
            })
            .filter(item => {
              if (item) return true;
              return false;
            })[0];

          // If has template, create a new survey from template otherwise create a blank survey
          if (subGroup?.surveyId) {
            const resp = await api.get(`surveys/${subGroup?.surveyId}`);
            pages = resp.data.pages;
            const responseGetAccessesFromTemplate = await api.get(
              `/accesses/survey/${subGroup?.surveyId}`,
            );
            accessesFromTemplate = responseGetAccessesFromTemplate.data;
          }
        }

        // If pages is empty, create a new one with elements (basic minimum structure to avoid adding questions errors)
        if (!pages || pages.length === 0) {
          pages = [{ name: 'page1', elements: [] }];
        }

        const survey: Survey = {
          name: data.name,
          title: data.name,
          pages,
          isTemplate: false,
          projectId: state?.projectId ? Number(state.projectId) : data.project,
          productId: data.product,
          subGroup: data.subGroup,
        };

        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          // subGroup: Yup.string().required('The user group is required'),
          // productId: Yup.number().required('The product is required'),
          projectId: Yup.number().required('The project is required'),
        });

        await schema.validate(survey, {
          abortEarly: false,
        });

        const responseSurvey = await api.post('/surveys', survey);

        if (
          responseSurvey.data.surveyId &&
          data.useTemplate &&
          accessesFromTemplate.length > 0
        ) {
          accessesFromTemplate.forEach(async access => {
            const accessPost = {
              name: access.name,
              surveyId: responseSurvey.data.surveyId, // survey created
              segments: access.segments,
              isLocked: false,
              placeholders: access.placeholders,
            };

            await api.post('/accesses', accessPost);
          });
        }

        history.push(`/surveys/${responseSurvey.data.surveyId}`);
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
            'An error occurred while creating the survey, please try again.',
        });
      }
    },
    [addToast, history, state?.projectId],
  );

  return (
    <>
      <h1>New Survey</h1>

      <FormProjectSurvey
        formRef={formRef}
        handleSubmit={handleSubmit}
        buttonText="Next"
        projectId={Number(state?.projectId)}
      ></FormProjectSurvey>
    </>
  );
};

export default CreateProjectSurvey;
