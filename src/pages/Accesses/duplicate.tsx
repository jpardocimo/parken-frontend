import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { FiCopy } from 'react-icons/fi';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface Access {
  surveyId: number;
  name: string;
  segments: string[];
  isLocked: boolean;
  placeholders: string[];
}

interface Props {
  access: Access;
}

const DuplicateButton: React.FC<Props> = ({ access }) => {
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: Access) => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('The name is required'),
          surveyId: Yup.number().required('The survey id is required'),
          segments: Yup.array(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const surveyResponse = await api.get(`/surveys/${data.surveyId}`);

        if (
          surveyResponse &&
          surveyResponse.data &&
          surveyResponse.data?.isLocked === true
        ) {
          addToast({
            type: 'error',
            title: 'Registration Error',
            description:
              'The access can not be duplicated because this survey is locked.',
          });
        } else {
          const response = await api.post('/accesses', access);

          if (response.data.accessId) {
            history.push(
              `/surveys/${data.surveyId}/accesses/edit/${response.data.accessId}`,
            ); // workaround to refresh grid. the useEffect is affected when surveyId is changed
          }

          history.push(`/surveys/${data.surveyId}/accesses`);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The access was duplicated successfully!',
          });
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          getValidationErrors(err);
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
    [addToast, access, history],
  );

  return (
    <>
      <Link to="#" onClick={() => handleSubmit(access)}>
        <FiCopy size={22} color={'#000'} />
      </Link>
    </>
  );
};

export default DuplicateButton;
