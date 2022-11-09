import React from 'react';
import Button from '../../components/Button';
import { Subtitle, ContainerButton } from './styles';

const LanguageSettings: React.FC = () => {
  return (
    <div>
      <h1>Set Language</h1>
      <Subtitle>System Language</Subtitle>
      <ContainerButton>
        <Button disabled>English</Button>
      </ContainerButton>
    </div>
  );
};

export default LanguageSettings;
