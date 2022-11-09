import React from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';

import Input from '../../../components/FormInput';

import Button from '../../../components/Button';

import { Container } from './styles';

interface SurveyText {
  title: string;
  text: string;
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: SurveyText;
  handleSubmit: SubmitHandler;
}

const FormImage: React.FC<Props> = props => {
  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        <h2>Title</h2>
        <Input type="text" name="title" placeholder="Enter the title" />

        <h2>Upload Image</h2>

        <Button type="submit" width="200px">
          {props.buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default FormImage;
