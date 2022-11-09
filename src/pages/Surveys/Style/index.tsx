import React, { useCallback, useRef, useEffect } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormStyle from './Form';
import { Container } from './styles';

interface Style {
  urlFavicon: string;
  browserTitle: string;
  buttonsColor: string;
  overlayBoxColor: string;
  urlLogo: string;
  urlRadarChart: string;

  headerImagePath?: string;
  headerImageId?: number;
}

interface State {
  surveyId: number;
  survey: any;
  pageTitle: string;
}

const CreateProject: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { state } = useLocation<State>();

  useEffect(() => {
    if (state.survey && state.survey.style) {
      formRef.current?.setFieldValue(
        'browserTitle',
        state.survey.style.browserTitle,
      );

      formRef.current?.setFieldValue(
        'buttonsColor',
        state.survey.style.buttonsColor,
      );

      formRef.current?.setFieldValue(
        'overlayBoxColor',
        state.survey.style.overlayBoxColor,
      );

      formRef.current?.setFieldValue(
        'urlFavicon',
        state.survey.style.urlFavicon,
      );

      formRef.current?.setFieldValue('urlLogo', state.survey.style.urlLogo);

      formRef.current?.setFieldValue(
        'urlRadarChart',
        state.survey.style.urlRadarChart,
      );

      formRef.current?.setFieldValue(
        'headerColor',
        state.survey.style.headerColor,
      );

      formRef.current?.setFieldValue(
        'heightLogo',
        state.survey.style.heightLogo,
      );

      formRef.current?.setFieldValue(
        'headerImagePath',
        state.survey.style.header.filePath,
      );

      const headerFilePath: string = state.survey?.style?.header?.filePath;
      const headerFieldLabel: string = headerFilePath?.substring(
        headerFilePath.lastIndexOf('/') + 1,
      );

      formRef.current?.setFieldValue('headerImageId', {
        value: state.survey.style?.header?.id,
        filePath: state.survey.style.header?.filePath,
        label: headerFieldLabel,
      });
    }
  }, [state]);

  const handleSubmit: SubmitHandler = useCallback(
    async (data: Style) => {
      const surveyResponse = await api.get(`/surveys/${state.surveyId}`);

      if (
        surveyResponse &&
        surveyResponse.data &&
        surveyResponse.data?.isLocked === true
      ) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'You can not change the styles because this survey is locked.',
        });
      } else {
        try {
          formRef.current?.setErrors({});

          await api.put(`/surveys/${state.surveyId}/style`, data);

          history.push(`/surveys/${state?.surveyId}`);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The style was saved successfully!',
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
              'An error occurred while editing project, please try again.',
          });
        }
      }
    },
    [addToast, history, state.surveyId],
  );

  return (
    <Container>
      <h1>Style</h1>
      {state?.pageTitle && <h2>{state?.pageTitle}</h2>}

      <>
        <FormStyle
          formRef={formRef}
          handleSubmit={handleSubmit}
          initialData={state.survey}
          buttonText="Save"
        />
      </>
    </Container>
  );
};

export default CreateProject;
