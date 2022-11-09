import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';

import api from '../../../services/api';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Switch from '../../../components/Switch';
import Button from '../../../components/Button';

import { Container } from './styles';

interface Survey {
  name: string;
  type: string;
}

interface Project {
  projectId: number;
  name: string;
}

interface Product {
  productId: number;
  name: string;
  subGroup?: string;
  userGroups: UserGroup[];
}

interface UserGroup {
  name?: string;
  subGroups?: object[];
  structure?: object[];
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: Survey;
  handleSubmit: SubmitHandler;
  isEdit?: boolean;
  projectId?: number;
}

const FormSurvey: React.FC<Props> = props => {
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [useTemplate, setUseTemplate] = useState(false);

  useEffect(() => {
    api.get('projects').then(response => {
      setProjects(
        response.data.map((project: Project) => {
          return {
            value: project.projectId,
            label: project.name,
          };
        }),
      );
    });

    api.get('products').then(response => {
      setProducts(
        response.data.map((prod: Product) => {
          return {
            value: prod.productId,
            label: prod.name,
          };
        }),
      );
    });

    api.get('subGroups').then(response => {
      setSubGroups(response.data);
    });
  }, []);

  const handleSwitchChange = useCallback(value => {
    setUseTemplate(value);
  }, []);

  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        {!props.projectId && (
          <>
            <h2>Project</h2>
            <Select name="project" options={projects} />
          </>
        )}

        <h2>Name</h2>
        <Input type="text" name="name" placeholder="Enter the title" />

        <h2>Sub Group</h2>
        <Select name="subGroup" options={subGroups} />

        <h2>Product</h2>
        <Select name="product" options={products} />

        <h2>Use Template</h2>
        <Switch
          name="useTemplate"
          handleSwitchChange={handleSwitchChange}
          initialValue={useTemplate}
        />

        {/* {useTemplate && (
          <>
            <h2>Product</h2>
            <Select name="product" options={products} />
          </>
        )} */}

        <Button type="submit" width="200px">
          {props.buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default FormSurvey;
