import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import EnumProductUserGroup from '../../../utils/enums/EnumProductUserGroup';
import EnumProductSubGroup from '../../../utils/enums/EnumProductSubGroup';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Button from '../../../components/Button';

import { Container } from './styles';

interface Product {
  name: string;
  subGroup?: string;
  userGroups: UserGroup[];
}

interface UserGroup {
  name?: string;
  subGroups?: object[];
  structure?: object[];
}

interface Survey {
  name: string;
  title: string;
  pages: object[];
  isTemplate: boolean;
  subGroup: string;
}

const CreateProduct: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const [subGroup, setSubGroup] = useState();
  const [subGroups, setSubGroups] = useState([]);

  useEffect(() => {
    api.get('subGroups').then(response => {
      setSubGroups(response.data);
    });
  }, []);

  const handleUserGroupChange = useCallback(newSubGroup => {
    setSubGroup(newSubGroup.value);
  }, []);

  const handleSubmit = useCallback(
    async (data: Product) => {
      try {
        // Create a blank survey template before product creation

        const subGroupName: string =
          Object.values(EnumProductSubGroup)[
            Object.keys(EnumProductSubGroup).indexOf(
              data.subGroup ? data.subGroup : '',
            )
          ];

        const surveyTemplate: Survey = {
          name: `${data.name} - ${subGroupName}`,
          title: `${data.name} - ${subGroupName}`,
          pages: [{ name: 'page1', elements: [] }],
          isTemplate: true,
          subGroup: data.subGroup ?? '',
        };

        const responseSurvey = await api.post('/surveys', surveyTemplate);

        // prepare initial product data with surveyId depending on subgroup chosen by user
        const product: Product = {
          ...data,
          userGroups: [
            {
              name: EnumProductUserGroup.Internal,
              subGroups: [
                {
                  name: Object.keys(EnumProductSubGroup)[
                    Object.values(EnumProductSubGroup).indexOf(
                      EnumProductSubGroup.Employees,
                    )
                  ],
                  surveyId:
                    data.subGroup ===
                    Object.keys(EnumProductSubGroup)[
                      Object.values(EnumProductSubGroup).indexOf(
                        EnumProductSubGroup.Employees,
                      )
                    ]
                      ? responseSurvey.data.surveyId
                      : null,
                },
                {
                  name: Object.keys(EnumProductSubGroup)[
                    Object.values(EnumProductSubGroup).indexOf(
                      EnumProductSubGroup.Management,
                    )
                  ],
                  surveyId:
                    data.subGroup ===
                    Object.keys(EnumProductSubGroup)[
                      Object.values(EnumProductSubGroup).indexOf(
                        EnumProductSubGroup.Management,
                      )
                    ]
                      ? responseSurvey.data.surveyId
                      : null,
                },
              ],
              structure: [],
            },
            {
              name: EnumProductUserGroup.External,
              subGroups: [
                {
                  name: Object.keys(EnumProductSubGroup)[
                    Object.values(EnumProductSubGroup).indexOf(
                      EnumProductSubGroup.Corporate,
                    )
                  ],
                  surveyId:
                    data.subGroup ===
                    Object.keys(EnumProductSubGroup)[
                      Object.values(EnumProductSubGroup).indexOf(
                        EnumProductSubGroup.Corporate,
                      )
                    ]
                      ? responseSurvey.data.surveyId
                      : null,
                },
                {
                  name: Object.keys(EnumProductSubGroup)[
                    Object.values(EnumProductSubGroup).indexOf(
                      EnumProductSubGroup.Retail,
                    )
                  ],
                  surveyId:
                    data.subGroup ===
                    Object.keys(EnumProductSubGroup)[
                      Object.values(EnumProductSubGroup).indexOf(
                        EnumProductSubGroup.Retail,
                      )
                    ]
                      ? responseSurvey.data.surveyId
                      : null,
                },
                {
                  name: Object.keys(EnumProductSubGroup)[
                    Object.values(EnumProductSubGroup).indexOf(
                      EnumProductSubGroup.Wealthy,
                    )
                  ],
                  surveyId:
                    data.subGroup ===
                    Object.keys(EnumProductSubGroup)[
                      Object.values(EnumProductSubGroup).indexOf(
                        EnumProductSubGroup.Wealthy,
                      )
                    ]
                      ? responseSurvey.data.surveyId
                      : null,
                },
              ],
              structure: [],
            },
          ],
        };

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Product name is required'),
          subGroup: Yup.string().required('Product user group is required'),
          userGroups: Yup.array().required('Product user group is required'),
        });

        await schema.validate(product, {
          abortEarly: false,
        });

        delete product.subGroup;

        await api.post('/products', product);

        history.push(`/surveys/${responseSurvey.data.surveyId}`);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The product was created successfully!',
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
            'An error occurred while creating product, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <h1>New Product</h1>

      <Form ref={formRef} onSubmit={handleSubmit}>
        <h2>Name</h2>
        <Input type="text" name="name" placeholder="Enter product name" />

        <h2>User Group</h2>
        <Select
          name="subGroup"
          options={subGroups}
          onChange={e => handleUserGroupChange(e)}
        />

        <Button type="submit" width="200px">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProduct;
