/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { EditOutlined } from '@material-ui/icons';
import BackButton from '../../components/BackButton';
import ButtonEb from '../../components/Button';

import { columns } from './columns';
import { Container, Content, ButtonContainer, Button } from './styles';

import api from '../../services/api';

import getEncodedSurvey from '../../utils/getEncodedSurvey';
import getDecodedSurvey from '../../utils/getDecodedSurvey';
import getDefaultQuestionType from '../../utils/getDefaultQuestionType';
import Table from '../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';

interface Access {
  segments: string[];
  name: string;
  accessId: number;
}

interface Page {
  elements: Element[];
}

interface Logo {
  logoId: number;
  filePath: string;
}

interface Choice {
  valueRate?: number;
  text: string;
  value: string;
}

interface Element {
  questionId: string;
  externalId: number;
  name: string;
  title: string;
  type: any;
  internalType: string;
  hideNumber: boolean;
  choices?: Choice[];
}

interface Survey {
  surveyId: number;
  name: string;
  title: string;
  description: string;
  type?: string;
  isTemplate: boolean;
  startTextId: number;
  finalTextId: number;
  projectId: number;
  logo: Logo;
  pages: Page[];
  accesses: Access[];
}

interface Question {
  questionId: string;
  text: string;
  value: number;
  externalId: number | string;
  typeLabel: string;
  internalType: string;
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

interface State {
  select: boolean;
  surveyId: number;
  pageTitle: string;
}

const Questions: React.FC = () => {
  const { state } = useLocation<State>();
  const history = useHistory();

  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [survey, setSurvey] = useState<Survey>();
  const [tableColumnExtensions] = useState([
    { columnName: 'questionId', width: 100 },
    { columnName: 'text', width: 800 },
    { columnName: 'options', width: 200 },
  ]);

  const handleClickEdit = useCallback(
    (row: any) => {
      history.push(
        `/questions/edit/${parseInt(row.questionId, 10).toString()}`,
      );
    },
    [history],
  );

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'edit',
      label: '',
      onClick: row => handleClickEdit(row),
      icon: <EditOutlined />,
    },
  ]);

  const toLowerCase = (value: string) => String(value).toLowerCase();

  const customFilterPredicate = useCallback((value, filter, row) => {
    if (
      toLowerCase(value).includes(toLowerCase(filter.value)) ||
      row.alternatives?.some((a: any) =>
        toLowerCase(a.text).includes(toLowerCase(filter.value)),
      )
    ) {
      return true;
    }

    return false;
  }, []);

  const integratedFilteringColumnExtensions = [
    { columnName: 'text', predicate: customFilterPredicate },
    // { columnName: 'externalId', predicate: customFilterPredicateExternalId },
  ];

  useEffect(() => {
    //* *Load Survey From Database */

    // We can improve this creating an endpoing and a unique query at mongodb
    // to get all elelemntos from survey. Doing this, we can avoid get the entire survey.
    if (state?.select) {
      api
        .get(`/surveys/${state.surveyId}`, {
          params: {
            surveyId: state.surveyId,
          },
        })
        .then(response => {
          const jsonFromDb = {
            surveyId: response.data.surveyId,
            pages: response.data.pages,
            description: response.data.description,
            name: response.data.name,
            title: response.data.title,
            isTemplate: response.data.isTemplate,
            logo: response.data.logo,
            subGroup: response.data.subGroup,
            projectId: response.data.projectId,
            startTextId: response.data.startTextId,
            finalTextId: response.data.finalTextId,
            accesses: response.data.accessess,
            style: response.data.style,
          };

          if (jsonFromDb) {
            const decodedSurvey = JSON.parse(
              JSON.stringify(getDecodedSurvey(jsonFromDb)),
            );

            setSurvey(decodedSurvey);
          }
        });
    }
  }, [state?.select, state?.surveyId]);

  useEffect(() => {
    //* *Load Questions From Database */

    api.get<Question[]>(`/questions`).then(response => {
      const questionsFormatted = response.data.map(question => {
        const alternativesArray = question.alternatives ?? [];

        return {
          questionId: question.questionId.toString(),
          externalId: question.externalId ? question.externalId : '',
          text: question.text,
          type: question.type,
          options: question.options,
          tags: question.tags,
          alternatives: alternativesArray.map((s: Question) => {
            return {
              questionId: `${question.questionId.toString()}.${s.value}`,
              externalId: question.externalId
                ? `${question.externalId}.${s.value}`
                : '',
              type: question.type?.label ? question.type?.label : question.type,
              options: question.options,
              tags: question.tags,
              text: s.text,
            };
          }),
        };
      });

      setQuestions(questionsFormatted);
    });
  }, []);

  useEffect(() => {
    //* *Set selected Ids loaded from survey*/
    setSelectedRowIds(
      survey &&
        survey.pages.flatMap(page =>
          page.elements
            .filter(element => element.type !== 'matrix' && element.questionId)
            .map(e => e.questionId),
        ),
    );
  }, [survey]);

  const handleConfirm = useCallback(async () => {
    // loop elements survey's array, checking if is included in newIds
    // if not, so the type is not matrix
    // and then get element's index to get question from matrix and let the element in the survey

    const newElements: Element[] = [];

    if (survey?.pages[0].elements) {
      survey?.pages[0].elements.forEach(item => {
        if (
          (item.type.toString().includes('pagebreak') &&
            item.name.includes('pagebreak')) ||
          (item.type.toString().includes('html') &&
            item.name.includes('html_')) ||
          (item.type.toString().includes('image') &&
            item.name.includes('image_'))
        ) {
          newElements.push(item);
        } else {
          const stillSelected = selectedRowIds.some(
            (newSelectedId: any) => newSelectedId == item.questionId,
          );

          if (stillSelected || item.type == 'matrix') {
            newElements.push(item);
          }
        }
      });
    }

    // check if element to survey exsists. If not, the element will be added
    selectedRowIds.forEach((id: any) => {
      const elementExists = survey?.pages[0]?.elements.some(
        (element: Element) => element.questionId == id,
      );

      if (!elementExists) {
        const elementToAdd = questions
          .filter((question: Question) => question.questionId == id)
          .map((questionSelected: any) => {
            return {
              questionId: questionSelected.questionId.toString(),
              externalId: questionSelected.externalId,
              name: `${questionSelected.questionId}-${questionSelected.text}`,
              title: questionSelected.text,
              type: getDefaultQuestionType(questionSelected.type),
              internalType: questionSelected.type,
              hideNumber: true,
              choices: questionSelected?.options?.map((o: Choice) => {
                return {
                  text: o.text,
                  value: o.value ?? o.text,
                };
              }),
            };
          })[0];

        if (elementToAdd) {
          newElements.push(elementToAdd);
        } else {
          const alternativeToAdd = questions
            ?.flatMap(({ alternatives }) =>
              alternatives.filter(
                (question: Question) => question.questionId == id,
              ),
            )
            ?.map((questionSelected: any) => {
              return {
                questionId: questionSelected.questionId.toString(),
                externalId: questionSelected.externalId,
                name: questionSelected.text,
                title: questionSelected.text,
                type: getDefaultQuestionType(questionSelected.type),
                internalType: questionSelected.type,
                hideNumber: true,
                choices: questionSelected?.options?.map((o: Choice) => {
                  return {
                    text: o.text,
                    value: o.value ?? o.text,
                  };
                }),
              };
            })[0];

          newElements.push(alternativeToAdd);
        }
      }
    });

    const newPageArray =
      survey &&
      survey.pages.map((page: Page) => {
        return {
          ...page,
          elements: [...newElements],
        };
      });

    // //* *  set survey with new questions preserving other values*/
    const newSurvey = {
      ...survey,
      pages: newPageArray,
    };

    // //* *  encode survey to Json and save into database*/

    const encodedSurveyTosave = getEncodedSurvey(JSON.stringify(newSurvey));

    await api.put(`/surveys/${survey?.surveyId}`, encodedSurveyTosave);
    history.push(`/surveys/${survey?.surveyId}`);
  }, [history, questions, selectedRowIds, survey]);

  return (
    <Container>
      {!!state?.select && <BackButton />}

      <h1>Questions</h1>

      {state?.pageTitle && (
        <>
          <h2>{state?.pageTitle}</h2>
        </>
      )}

      <Link
        to={{
          pathname: `/questions/new`,
        }}
      >
        <Button variant="contained" type="button">
          New Question
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={questions}
          selectionProp={selectedRowIds}
          multiSelection={true}
          actionColumns={actionColumns}
          hasFilterRow={true}
          checkboxSelection={!!state?.select}
          setSelectedRowId={setSelectedRowIds}
          tableColumnExtensions={tableColumnExtensions}
          integratedFilteringColumnExtensions={
            integratedFilteringColumnExtensions
          }
          idName={'questionId'}
        />

        {!!state?.select && (
          <ButtonContainer>
            <ButtonEb
              width="100px"
              height="40px"
              marginRight="18px"
              shadow={true}
              onClick={handleConfirm}
            >
              Confirm
            </ButtonEb>

            <Link to={''} onClick={history.goBack}>
              <ButtonEb width="100px" height="40px" shadow={true}>
                Back
              </ButtonEb>
            </Link>
          </ButtonContainer>
        )}
      </Content>
    </Container>
  );
};

export default Questions;
