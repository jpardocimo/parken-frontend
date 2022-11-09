import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Button from '../../../components/Button';

import { Container } from './styles';

interface Customer {
  name: string;
  employee: DropDownObject;
  industry: DropDownObject;
  sector: DropDownObject;
  countries: DropDownObject[];
  asset: DropDownObject;
}

interface DropDownObject {
  value: number;
  label: string;
}

interface ParamTypes {
  id: string;
}

const EditCustomer: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { id } = useParams<ParamTypes>();
  const history = useHistory();
  const { addToast } = useToast();

  const [customer, setCustomer] = useState<Customer>();

  useState<DropDownObject>();

  const [selectedCountries, setSelectedCountries] = useState(
    [] as DropDownObject[],
  );

  const [countries, setCountries] = useState<DropDownObject[]>();

  useEffect(() => {
    api.get('customerCountries').then(response => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`/customers/${id}`).then(response => {
      setCustomer(response.data);
      formRef.current?.setFieldValue('name', response.data.name);
      formRef.current?.setFieldValue('countries', response.data.countries);
    });
  }, [id]);

  const handleCountryChange = useCallback(countryList => {
    setSelectedCountries(countryList);
  }, []);

  const handleSubmit = useCallback(
    async (data: Customer) => {
      try {
        const editCustomer = {
          ...data,
          countries: selectedCountries,
        };

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Customer name is required'),
          countries: Yup.array().required('Customer country is required'),
        });

        await schema.validate(editCustomer, {
          abortEarly: false,
        });

        await api.put(`/customers/${id}`, editCustomer);

        history.push('/customers');
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
            'An error occurred while creating customer, please try again.',
        });
      }
    },
    [addToast, history, id, selectedCountries],
  );

  return (
    <Container>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Edit Customer</h1>

        <h2>Name</h2>
        <Input type="text" name="name" placeholder="Enter customer name" />

        <h2>Countries</h2>
        <Select
          isMulti
          name="countries"
          options={countries}
          className="basic-multi-select"
          onChange={e => handleCountryChange(e)}
        />

        <Button type="submit" width="200px">
          Save
        </Button>
      </Form>
    </Container>
  );
};
export default EditCustomer;
