/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useState } from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';

import {
  Container,
  Content,
  ButtonContainer,
  Button,
  HeaderBox,
  StyledIcon,
  DeleteIcon,
} from './styles';
import ButtonEb from '../../components/Button';

import api from '../../services/api';

import { columnsMatrix } from './columnsMatrix';
import { useToast } from '../../hooks/toast';
import getEncodedSurvey from '../../utils/getEncodedSurvey';
import getDecodedSurvey from '../../utils/getDecodedSurvey';
import Table from '../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';

interface Access {
  segments: string[];
  name: string;
  accessId: number;
}

interface Page {
  elements: Matrix[];
}

interface Logo {
  logoId: string;
  filePath: string;
}

interface Survey {
  surveyId: number;
  name: string;
  title: string;
  description: string;
  type?: string;
  isTemplate: boolean;
  startTextId: string;
  finalTextId: string;
  projectId: number;
  logo: Logo;
  pages: Page[];
  accesses: Access[];
}

interface Matrix {
  matrixId: string;
  type: string;
  name: string;

  title: string;
  descriptionLocation: string;
  hideNumber: boolean;
  columns: [];
  rows: [];
}

interface State {
  select: boolean;
  surveyId: number;
}

const MatrixList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [matrixes, setMatrixes] = useState<Matrix[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);
  const [removed, setRemoved] = useState(false);
  const { state } = useLocation<State>();
  const { addToast } = useToast();
  const history = useHistory();
  const [survey, setSurvey] = useState<Survey>();
  const [tableColumnExtensions] = useState([
    { columnName: 'matrixId', width: 100 },
    { columnName: 'title', width: 800 },
  ]);

  const handleClickDelete = useCallback(
    (row: any) => {
      try {
        api.delete(`/matrix/${row.matrixId}`).then(response => {
          if (response.data) {
            if (row.matrixId !== undefined) {
              row?.api?.updateRows([
                { matrixId: row.matrixId, _action: 'delete' },
              ]);

              addToast({
                type: 'success',
                title: 'Success',
                description: 'The matrix was deleted successfully!',
              });

              setRemoved(true);

              const surveyId = localStorage.getItem('@Victor:surveyId');
              history.push(`/matrixQuestions/-1`);
              history.push('/matrixQuestions', {
                select: true,
                surveyId: surveyId && surveyId,
              });
            }
          } else {
            addToast({
              type: 'info',
              title: 'Deleting Warning',
              description: `This Matrix cannot be deleted, beacuse exists in some survey.`,
            });
          }
        });
      } catch (err) {
        if (err) {
          addToast({
            type: 'error',
            title: 'Deleting Error',
            description: `An error occurred while deleting matrix, please try again.`,
          });
        }
      }
    },
    [addToast, history],
  );

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'delete',
      label: '',
      onClick: handleClickDelete,
      icon: <DeleteIcon />,
    },
  ]);

  useEffect(() => {
    // load survey from database
    if (state?.select) {
      api
        .get(`/surveys/${state.surveyId}`, {
          params: {
            id: state.surveyId,
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
    // set selected rowsIds from survey
    setSelectedRowIds(
      survey &&
        survey.pages.flatMap(page =>
          page.elements
            .filter(element => element.type === 'matrix' && element.matrixId)
            .map(e => e.matrixId),
        ),
    );
  }, [survey]);

  useEffect(() => {
    setLoading(true);

    api.get('matrix').then(response => {
      setMatrixes(response.data);
    });

    setLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      const newElements: Matrix[] = [];

      if (survey?.pages[0].elements) {
        survey?.pages[0].elements.forEach((item: any) => {
          if (
            (item.type.toString().includes('pagebreak') &&
              item.name.includes('pagebreak')) ||
            (item.type.toString().includes('html') &&
              item.name.includes('html_'))
          ) {
            newElements.push(item);
          } else {
            const stillSelected = selectedRowIds.some(
              (newSelectedId: any) => newSelectedId == item.matrixId,
            );

            if (stillSelected || item.type !== 'matrix') {
              newElements.push(item);
            }
          }
        });
      }

      selectedRowIds.forEach((matrixId: any) => {
        const elementExists =
          survey?.pages[0] &&
          survey?.pages[0].elements.some(
            (element: Matrix) => element.matrixId == matrixId,
          );

        if (!elementExists) {
          const elementToAdd = matrixes
            .filter((matrix: Matrix) => matrix.matrixId == matrixId)
            .map((data: Matrix) => {
              return {
                title: data.title,
                type: data.type,
                name: data.name,
                descriptionLocation: data.descriptionLocation,
                matrixId: data.matrixId.toString(),
                hideNumber: true,
                columns: data.columns,
                rows: data.rows,
              };
            })[0];

          newElements.push(elementToAdd);
        }
      });

      const surveyJson = survey;

      const newPageArray =
        survey?.pages &&
        survey?.pages.map((page: any) => {
          return {
            ...page,
            elements: newElements && [...newElements],
          };
        });

      //* *  set survey with new questions preserving other values*/
      const newSurvey = {
        ...surveyJson,
        pages: newPageArray,
      };

      const encodedSurveyTosave = getEncodedSurvey(JSON.stringify(newSurvey));

      await api.put(`/surveys/${survey?.surveyId}`, encodedSurveyTosave);

      history.push(`/surveys/${survey?.surveyId}`);
    } catch (err) {
      if (err) {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description: `An error occurred while updating survey, please try again.`,
        });
      }
    }
  }, [addToast, history, matrixes, selectedRowIds, survey]);

  return (
    <Container>
      <HeaderBox>
        <Link to={`/surveys/${survey?.surveyId}`}>
          <StyledIcon>{`<`}</StyledIcon>
        </Link>
        <h1>Matrix Questions</h1>
      </HeaderBox>

      <Link
        to={{
          pathname: `/matrixQuestions/step1`,
          state: {
            select: state?.select,
            surveyId: survey?.surveyId,
          },
        }}
      >
        <Button variant="contained" type="button">
          New Matrix Question
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columnsMatrix}
          dataProp={matrixes}
          selectionProp={selectedRowIds}
          multiSelection={true}
          actionColumns={actionColumns}
          checkboxSelection={!!state?.select}
          setSelectedRowId={setSelectedRowIds}
          tableColumnExtensions={tableColumnExtensions}
          hasFilterRow={true}
          idName={'matrixId'}
        />

        {!!state?.select && (
          <ButtonContainer>
            <ButtonEb
              width="100px"
              height="40px"
              marginRight="18px"
              shadow={true}
              onClick={() => handleConfirm()}
            >
              Confirm
            </ButtonEb>

            <Link to={`/surveys/${survey?.surveyId}`}>
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
export default MatrixList;
