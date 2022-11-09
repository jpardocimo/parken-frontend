/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import {
  Container,
  Content,
  HeaderBox,
  StyledIcon,
  ButtonContainer,
} from './styles';

import api from '../../../../services/api';

import { useToast } from '../../../../hooks/toast';
import getValidationErrors from '../../../../utils/getValidationErrors';

import { columns } from './columns';
import Input from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import Table from '../../../../components/DevExpressTable/DevExpressTable';

interface Matrix {
  matrixId: number;
  type: string;
  name: string;
  title: string;
  descriptionLocation: string;
  columns: [];
  rows: [];
}

interface Question {
  questionId: number | string;
  text: string;
  value: number;
  externalId: number | string;
  typeLabel: string;
  type: { value: string; label: string };
  tags: {
    label: string;
  }[];
  alternatives: Question[];
  options: Option[];
}

interface Option {
  text?: string;
  optionText?: string;
}

interface StateFromPreviousPage {
  option: Option;
  selectedOption: any[];
}

interface State {
  select: boolean;
  surveyId: number;
  // survey: any;
}

const CreateMatrixStep2: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { state: stateFromPreviousPage } = useLocation<StateFromPreviousPage>();
  const { state } = useLocation<State>();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>();

  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);

  const [tableColumnExtensions] = useState([
    { columnName: 'questionId', width: 100 },
    { columnName: 'text', width: 800 },
    { columnName: 'options', width: 200 },
  ]);

  const toLowerCase = (value: string) => String(value).toLowerCase();

  useEffect(() => {
    const selectedQuestionsLocal = questions.map((question: any) => {
      const questionIdFound = selectedRowIds.some(
        (id: any) => id == question.questionId,
      );

      if (questionIdFound) return question;

      return null;
    });

    const selectedAlternativesLocal = questions.flatMap(
      ({ alternatives }: any) =>
        alternatives.map((alternative: any) => {
          const alternativeFound = selectedRowIds.some(
            (id: any) => id == alternative.questionId,
          );

          if (alternativeFound)
            return { ...alternative, options: alternative.options };

          return null;
        }),
    );

    const finalSelectedArray = [
      ...selectedQuestionsLocal,
      ...selectedAlternativesLocal,
    ];

    setSelectedQuestions(
      finalSelectedArray.filter(question => question != null),
    );
  }, [questions, selectedRowIds]);

  const customFilterPredicate = useCallback((value, filter, row) => {
    if (
      value.includes(filter.value) ||
      row.alternatives.some((a: any) =>
        toLowerCase(a.text).includes(toLowerCase(filter.value)),
      )
    ) {
      return true;
    }

    return false;
  }, []);

  const integratedFilteringColumnExtensions = [
    { columnName: 'text', predicate: customFilterPredicate },
  ];

  const handleSubmit = useCallback(
    async (data: Matrix) => {
      try {
        const newMatrix = {
          ...data,
          descriptionLocation: 'underTitle',
          name: data.title,
          minWidth: '',
          maxWidth: '',
          columns:
            selectedQuestions &&
            selectedQuestions[0].options.map((option: any) => {
              return {
                text: option.text,
                value: option.value,
              };
            }),
          rows: selectedQuestions?.map(e => {
            return {
              text: e.text,
              questionIdMatrix: e.questionId,
              externalId: e.externalId,
              value: e.questionId,
            };
          }),
          type: 'matrix',
        };

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Customer title is required'),

          rows: Yup.array().required('Question is required'),
        });

        await schema.validate(newMatrix, {
          abortEarly: false,
        });

        await api.post('/matrix', newMatrix);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The matrix was created successfully!',
        });

        history.push('/matrixQuestions', {
          select: true,
          surveyId: state?.surveyId,
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
            'An error occurred while creating matrix, please try again.',
        });
      }
    },
    [addToast, history, selectedQuestions, state?.surveyId],
  );

  useEffect(() => {
    setLoading(true);

    const arrayOptions =
      stateFromPreviousPage &&
      stateFromPreviousPage.selectedOption.map((option: Option) => {
        return {
          text: option,
        };
      });

    api.post<Question[]>(`questions/list/`, arrayOptions).then(response => {
      const questionsFormatted = response.data.map(question => {
        const alternativesArray = question.alternatives ?? [];

        return {
          questionId: question.questionId.toString(),
          externalId: question.externalId,
          text: question.text,
          type: question.type?.label ? question.type?.label : question.type,
          options: question.options,
          tags: question.tags,
          alternatives: alternativesArray.map((s: Question) => {
            return {
              questionId: `${question.questionId.toString()}.${s.value}`,
              externalId: `${question.externalId}.${s.value}`,
              type: question.type?.label ? question.type?.label : question.type,
              options: question.options,
              tags: question.tags,
              text: s.text,
            };
          }),
        };
      });

      setQuestions(questionsFormatted);
      setLoading(false);
    });
  }, [stateFromPreviousPage]);

  return (
    <Container>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <HeaderBox>
          <Link
            to={{
              pathname: `/matrixQuestions/step1`,
              state: {
                select: state?.select,
                surveyId: state?.surveyId,
              },
            }}
          >
            <StyledIcon />
          </Link>
          <h1>New Matrix - Questions</h1>
        </HeaderBox>

        <h2>Matrix Name</h2>
        <Input type="text" name="title" placeholder="Enter matrix title" />

        <h2>Select questions</h2>
        <Content>
          <Table
            columnsProp={columns}
            dataProp={questions}
            selectionProp={selectedRowIds}
            multiSelection={true}
            checkboxSelection={!!state?.select}
            setSelectedRowId={setSelectedRowIds}
            tableColumnExtensions={tableColumnExtensions}
            integratedFilteringColumnExtensions={
              integratedFilteringColumnExtensions
            }
            hasFilterRow={true}
            idName={'questionId'}
          />
        </Content>

        <ButtonContainer>
          <Button type="submit" width="150px" height="40px" shadow={true}>
            Create Matrix
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};
export default CreateMatrixStep2;
