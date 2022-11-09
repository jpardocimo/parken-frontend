import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Button from '../../../components/Button';

import { Container } from './styles';

interface Customer {
  name: string;
  employee: SelectProps;
  industry: SelectProps;
  sector: SelectProps;
  countries: SelectProps[];
  asset: SelectProps;
}

interface SelectProps {
  value: number;
  label: string;
}

const CreateCustomer: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const [selectedCountries, setSelectedCountries] = useState(
    [] as SelectProps[],
  );

  const [countries, setCountries] = useState<SelectProps[]>();

  useEffect(() => {
    api.get('customerCountries').then(response => {
      setCountries(response.data);
    });
  }, []);

  const handleCountryChange = useCallback(countryList => {
    setSelectedCountries(countryList);
  }, []);

  const handleSubmit = useCallback(
    async (data: Customer) => {
      try {
        const newCustomer = {
          ...data,
          // employee: selectedEmployeeNumber,
          // sector: selectedSector,
          // industry: selectedIndustry,
          countries: selectedCountries,
          // asset: selectedAsset,
          // revenue: selectedRevenue,
        };

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Customer name is required'),

          countries: Yup.array().required('Customer country is required'),
        });

        await schema.validate(newCustomer, {
          abortEarly: false,
        });

        const response = await api.post('/customers', newCustomer);

        history.push('/projects/new', {
          customerId: response.data.customerId,
          name: response.data.name,
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
            'An error occurred while creating customer, please try again.',
        });
      }
    },
    [addToast, history, selectedCountries],
  );

  return (
    <Container>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>New Customer</h1>

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
          Continue
        </Button>
      </Form>
    </Container>
  );
};
export default CreateCustomer;
