import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { DeleteOutline } from '@material-ui/icons';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface Access {
  accessId: number;
  surveyId: number;
  name: string;
  segments: string[];
  isLocked: boolean;
}

interface Props {
  access: Access;
}

const DeleteButton: React.FC<Props> = ({ access }) => {
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: Access) => {
      try {
        // eslint-disable-next-line no-restricted-globals, no-alert
        const userWantDelete = confirm(
          `Are you sure you want to delete the access ${data.accessId}?`,
        );
        if (userWantDelete) {
          const responseDelete = await api.delete(`/accesses/${data.accessId}`);

          if (responseDelete.data === null) {
            addToast({
              type: 'error',
              title: 'Registration Error',
              description: 'Survey is locked. You can not delete the access.',
            });
          } else {
            addToast({
              type: 'success',
              title: 'Success',
              description: 'The access was removed successfully!',
            });
            // history.push(`/surveys/-1/accesses`); // workaround to refresh grid. the useEffect is affected when surveyId is changed
            history.push(
              `/surveys/${data.surveyId}/accesses/edit/${data.accessId}`,
            );
            history.push(`/surveys/${data.surveyId}/accesses`);
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          return;
        }

        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'An error occurred while deleting the access, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Link to="#" onClick={() => handleSubmit(access)}>
        <DeleteOutline />
      </Link>
    </>
  );
};

export default DeleteButton;
