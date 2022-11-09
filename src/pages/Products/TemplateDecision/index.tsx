/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';

import Select from '../../../components/SelectForm';
import Button from '../../../components/Button';

import { Container } from './styles';
import getUserGroupBySubGroup from '../../../utils/getUserGroupBySubGroup';
import EnumProductSubGroup from '../../../utils/enums/EnumProductSubGroup';

interface Product {
  productId: number;
  name: string;
  subGroup: string;
  userGroups: UserGroup[];
}

interface UserGroup {
  name?: string;
  subGroups?: SubGroup[];
  structure?: object[];
}

interface SubGroup {
  name: string;
  surveyId?: number;
}

interface Survey {
  name: string;
  title: string;
  pages: object[];
  isTemplate: boolean;
  subGroup: string;
}

interface StateFromProductPage {
  product: Product;
  selectedUserGroup: string;
  isSurveyTemplateScreen: boolean;
}

const TemplateDecision: React.FC = () => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const { state: stateFromPreviousPage } = useLocation<StateFromProductPage>();
  const history = useHistory();
  const [subGroup, setSubGroup] = useState<any>();
  const [subGroupsState, setSubGroups] = useState<any>([]);
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    api.get('subGroups').then(response => {
      response.data.push({
        value: 'No',
        label: 'No, I want an empty survey template.',
      });

      setSubGroups(response.data);

      setPageTitle(
        Object.values(EnumProductSubGroup)[
          Object.keys(EnumProductSubGroup).indexOf(
            stateFromPreviousPage?.selectedUserGroup,
          )
        ],
      );
    });
  }, [stateFromPreviousPage]);

  const handleUserGroupChange = useCallback(newSubGroup => {
    setSubGroup(newSubGroup.value);
  }, []);

  const duplicateSurvey = useCallback(
    async (survey: any) => {
      try {
        survey.isTemplate = true;
        survey.name = survey.title;

        delete survey._id;
        delete survey.surveyId;
        delete survey.__v;
        delete survey.created_by;
        delete survey.updated_by;

        await api.post('/surveys', survey).then(response => {
          const dataUpdateProductSurvey = {
            nameUserGroup:
              stateFromPreviousPage.selectedUserGroup &&
              getUserGroupBySubGroup(
                Object.values(EnumProductSubGroup)[
                  Object.keys(EnumProductSubGroup).indexOf(
                    stateFromPreviousPage.selectedUserGroup,
                  )
                ],
              ),
            nameSubGroup: stateFromPreviousPage.selectedUserGroup,
            productId: stateFromPreviousPage.product?.productId,
            surveyId: response.data.surveyId,
          };

          api.put('products/survey', dataUpdateProductSurvey);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The survey was duplicated successfully!',
          });

          history.push(`/surveys/${response.data.surveyId}`);
        });
      } catch (err) {
        if (err) {
          addToast({
            type: 'error',
            title: 'Registration Error',
            description: `An error occurred while duplicating survey, please try again.`,
          });
        }
      }
    },
    [addToast, history, stateFromPreviousPage],
  );

  const handleClick = useCallback(async () => {
    try {
      if (subGroup === 'No') {
        const surveyTemplate: Survey = {
          name: `${stateFromPreviousPage.product.name} - ${
            Object.values(EnumProductSubGroup)[
              Object.keys(EnumProductSubGroup).indexOf(
                stateFromPreviousPage.selectedUserGroup
                  ? stateFromPreviousPage.selectedUserGroup
                  : '',
              )
            ]
          }`,
          title: `${stateFromPreviousPage.product.name} - ${
            Object.values(EnumProductSubGroup)[
              Object.keys(EnumProductSubGroup).indexOf(
                stateFromPreviousPage.selectedUserGroup
                  ? stateFromPreviousPage.selectedUserGroup
                  : '',
              )
            ]
          }`,
          pages: [{ name: 'page1', elements: [] }],
          isTemplate: true,
          subGroup: stateFromPreviousPage.selectedUserGroup ?? '',
        };

        duplicateSurvey(surveyTemplate);

        return;
      }

      if (!subGroup) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description: `Select a User Group to continue!`,
        });

        return;
      }

      const selectedMainUserGroup = getUserGroupBySubGroup(
        Object.values(EnumProductSubGroup)[
          Object.keys(EnumProductSubGroup).indexOf(subGroup)
        ],
      );

      const idSurveyFromUserGroup =
        stateFromPreviousPage.product &&
        stateFromPreviousPage.product?.userGroups
          .filter((ug: UserGroup) => ug.name === selectedMainUserGroup)
          .flatMap(({ subGroups }: any) => {
            return subGroups && subGroups.flatMap((x: any) => ({ ...x }));
          })
          .find((item: any) => item?.name === subGroup);

      const idSurveyToCopy =
        idSurveyFromUserGroup && idSurveyFromUserGroup.surveyId;

      if (!idSurveyToCopy) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'The selected User Group has no Surveys in this project!',
        });
        return;
      }

      const response = await api.get(`surveys/${idSurveyToCopy}`);

      const nameOriginal = response.data.name;

      const subgroupSurveyOriginal =
        Object.values(EnumProductSubGroup)[
          Object.keys(EnumProductSubGroup).indexOf(subGroup)
        ];

      const nameNewSurvey = nameOriginal.replace(
        subgroupSurveyOriginal,
        pageTitle,
      );

      const survey = {
        ...response.data,
        name: nameNewSurvey,
        title: nameNewSurvey,
        subGroup: stateFromPreviousPage?.selectedUserGroup,
      };

      duplicateSurvey(survey);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        description:
          'An error occurred while creating a survey copy, please try again.',
      });
    }
  }, [
    subGroup,
    stateFromPreviousPage.product,
    stateFromPreviousPage.selectedUserGroup,
    pageTitle,
    duplicateSurvey,
    addToast,
  ]);

  return (
    <Container>
      <h1>{`New Survey Template for ${pageTitle}`}</h1>

      <Form ref={formRef} onSubmit={handleClick}>
        <span>
          Create an empty template for a product or copy from other user group.
        </span>

        <h2>User Group</h2>

        <Select
          name="subGroup"
          options={subGroupsState}
          placeholder={
            'Select a user group to create a copy or select "No" to create an empty one.'
          }
          onChange={e => handleUserGroupChange(e)}
        />

        <Button type="submit" width="200px">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default TemplateDecision;
