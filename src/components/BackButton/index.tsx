/* eslint-disable eqeqeq */
import React, { ButtonHTMLAttributes } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from './styles';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  url?: string;
}

const BackButton: React.FC<Props> = ({ url, ...rest }) => {
  const history = useHistory();

  return (
    <Button
      onClick={() =>
        url && url !== '' ? history.push(url ?? '') : history.goBack()
      }
    >
      <FiArrowLeft />
      Back
    </Button>
  );
};

export default BackButton;
