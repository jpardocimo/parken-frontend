import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormAccess from '../Form';
import BackButton from '../../../components/BackButton';

interface Placeholder {
  replaceValue: string;
  searchValue: string;
}
interface Access {
  accessId: number;
  surveyId: number;
  name: string;
  segments: string[];
  isLocked: boolean;
  results: Result[];
  surveyName: string;
  placeholders: Placeholder[];
  subgroup: string;
  projectName?: string;
  subGroupSurvey?: string;
}

interface AccessForm {
  name: string;
  segments: string[];
  placeholders: string;
  isLocked: boolean;
}

interface Result {
  resultId: number;
  code: string;
  createdByUser: boolean;
}

interface ParamTypes {
  accessId: string;
  surveyId: string;
}

const EditAccess: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { accessId, surveyId } = useParams<ParamTypes>();
  const [access, setAccess] = useState<Access>();
  const [surveyIsLocked, setSurveyIsLocked] = useState<boolean>(false);
  const [surveyIsTemplate, setSurveyIsTemplate] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    api.get(`/accesses/${accessId}`).then(response => {
      setAccess(response.data);

      formRef.current?.setFieldValue(
        'segments',
        response.data.segments.map((segment: string) => {
          return {
            value: segment,
            label: segment,
          };
        }),
      );
    });

    api.get(`/surveys/${surveyId}`).then(surveyResponse => {
      if (
        surveyResponse &&
        surveyResponse.data &&
        surveyResponse.data?.isLocked === true
      ) {
        setSurveyIsLocked(true);
      } else {
        setSurveyIsLocked(false);
      }

      if (
        surveyResponse &&
        surveyResponse.data &&
        surveyResponse.data?.isTemplate === true
      ) {
        setSurveyIsTemplate(true);
      } else {
        setSurveyIsTemplate(false);
      }
    });
  }, [accessId, surveyId]);

  const handleSubmit = useCallback(
    async (data: AccessForm) => {
      try {
        formRef.current?.setErrors({});

        const accessNew = {
          name: data.name,
          segments: data.segments,
          placeholders: JSON.parse(data.placeholders),
          isLocked: data.isLocked,
        };

        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          segments: Yup.array(),
        });

        await schema.validate(accessNew, {
          abortEarly: false,
        });

        if (surveyIsLocked) {
          addToast({
            type: 'error',
            title: 'Registration Error',
            description:
              'You can not save changes because this survey is locked.',
          });
        } else {
          await api.put(`/accesses/${accessId}`, accessNew);

          history.push(`/surveys/${surveyId}/accesses`);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The access was saved successfully!',
          });
        }
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
            'An error occurred while editing the access, please try again.',
        });
      }
    },
    [surveyIsLocked, addToast, accessId, history, surveyId],
  );

  const handleRemoveCode = useCallback(
    async (row: Result) => {
      if (surveyIsLocked) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'You can not remove codes because this survey is locked.',
        });
      } else {
        try {
          // eslint-disable-next-line
          if (window.confirm('Are you sure you want to delete this code?')) {
            await api.delete(`/results/${row.resultId}`);
            api.get(`/accesses/${accessId}`).then(response => {
              setAccess(response.data);
            });

            addToast({
              type: 'success',
              title: 'Success',
              description: 'The code was removed successfully!',
            });
          }
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Registration Error',
            description:
              'An error occurred while deleting the code, please try again.',
          });
        }
      }
    },
    [accessId, addToast, surveyIsLocked],
  );

  const handleCreateCode = useCallback(() => {
    if (surveyIsLocked) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        description: 'You can not create code because this survey is locked.',
      });
    } else {
      try {
        const numberOfCodes = formRef.current?.getFieldValue('numberCodes');

        if (numberOfCodes) {
          addToast({
            type: 'info',
            title: 'Info',
            description: 'The codes are being created, wait for completion.',
          });

          api
            .post(`/results/createCodes/${numberOfCodes}`, {
              accessId,
              surveyId,
              testMode: false,
            })
            .then(response => {
              api.get(`/accesses/${accessId}`).then(responseAccess => {
                setAccess(responseAccess.data);
              });

              formRef.current?.setFieldValue('numberCodes', '');

              addToast({
                type: 'success',
                title: 'Success',
                description: 'The codes were created successfully!',
              });
            });
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'An error occurred while creating the codes, please try again.',
        });
      }
    }
  }, [surveyIsLocked, addToast, accessId, surveyId]);

  return (
    <>
      <BackButton />

      <h1>Edit {access?.name}</h1>
      <h2>
        {access?.projectName} - {access?.surveyName} - {access?.subGroupSurvey}
      </h2>
      <FormAccess
        formRef={formRef}
        handleSubmit={handleSubmit}
        handleRemoveCode={handleRemoveCode}
        handleCreateCode={handleCreateCode}
        initialData={access}
        buttonText="Save"
        isTemplate={surveyIsTemplate}
      />
    </>
  );
};

export default EditAccess;
