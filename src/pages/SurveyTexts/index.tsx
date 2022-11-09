import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';

import Table from '../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';
import { columns } from './columns';

import BackButton from '../../components/BackButton';
import ButtonEb from '../../components/Button';

import { Container, Content, Button, EditIcon } from './styles';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getEncodedSurvey from '../../utils/getEncodedSurvey';

interface SurveyText {
  surveyTextId: string;
  title: string;
  text: string;
  isStartText: boolean;
}

interface ParamTypes {
  textType: string;
}

interface State {
  select: boolean;
  surveyId: number;
  survey: any;
  selectedStartTextId?: string;
  selectedFinalTextId?: string;
  pageTitle?: string;
}

const SurveyTexts: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [surveyTexts, setSurveyTexts] = useState<SurveyText[]>([]);
  const { textType } = useParams<ParamTypes>();
  const [pageTitle, setPageTitle] = useState('Start');
  const { state } = useLocation<State>();

  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);

  const { addToast } = useToast();

  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'surveyTextId', width: 120 },
    { columnName: 'title', width: 300 },
    { columnName: 'text', width: 1280 },
    { columnName: 'delete', width: 80 },
  ]);

  const handleClickEdit = useCallback(
    (row: any) => {
      history.push(`/surveyTexts/edit/${row.surveyTextId}`);
    },
    [history],
  );

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'edit',
      label: '',
      onClick: handleClickEdit,
      icon: <EditIcon />,
    },
  ]);

  useEffect(() => {
    setLoading(true);
    setPageTitle(textType === 'start' ? 'Start' : 'Final');

    const url =
      textType === 'start'
        ? 'surveyTexts/textType/true'
        : 'surveyTexts/textType/false';

    api.get(url).then(response => {
      setSurveyTexts(
        response.data.map((surveyText: SurveyText) => {
          return {
            ...surveyText,
            surveyTextId: surveyText.surveyTextId.toString(),
          };
        }),
      );

      if (state?.selectedStartTextId && textType === 'start')
        setSelectedRowIds([state.selectedStartTextId]);
      else if (state?.selectedFinalTextId && textType !== 'start')
        setSelectedRowIds([state.selectedFinalTextId]);
    });

    setLoading(false);
  }, [textType, state?.selectedStartTextId, state?.selectedFinalTextId]);

  const handleConfirm = useCallback(async () => {
    try {
      const surveyJson = state?.survey;

      const survey = {
        ...surveyJson,
        ...(textType === 'start'
          ? { startTextId: selectedRowIds[0]?.toString() }
          : { finalTextId: selectedRowIds[0]?.toString() }),
      };

      const encodedSurveyTosave = getEncodedSurvey(JSON.stringify(survey));

      const response = await api.put(
        `/surveys/${state?.surveyId}`,
        encodedSurveyTosave,
      );

      if (response.data === null) {
        addToast({
          type: 'error',
          title: 'Updating Error',
          description: `This survey is locked. No changes were saved.`,
        });
      } else {
        history.push(`/surveys/${state?.surveyId}`);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The survey text was selected successfully!',
        });
      }
    } catch (err) {
      if (err) {
        addToast({
          type: 'error',
          title: 'Updating Error',
          description: `An error occurred while updating survey, please try again.`,
        });
      }
    }
  }, [
    state?.survey,
    state?.surveyId,
    textType,
    selectedRowIds,
    history,
    addToast,
  ]);

  return (
    <Container className={loading ? 'loading' : ''}>
      {!!state?.select && <BackButton />}

      <h1>{pageTitle} Texts</h1>

      {state?.pageTitle && <h2>{state?.pageTitle}</h2>}

      <Link
        to={{
          pathname: `/surveyTexts/new`,
          state: {
            isStartText: textType === 'start',
          },
        }}
      >
        <Button variant="contained" type="button">
          New {pageTitle} Text
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={surveyTexts}
          selectionProp={selectedRowIds?.map(String)}
          multiSelection={false}
          setSelectedRowId={setSelectedRowIds}
          checkboxSelection={!!state?.select}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'surveyTextId'}
        ></Table>

        {!!state?.select && (
          <>
            <ButtonEb
              width="120px"
              height="40px"
              marginRight="30px"
              onClick={handleConfirm}
            >
              Confirm
            </ButtonEb>

            <Link to={''} onClick={history.goBack}>
              <ButtonEb width="120px" height="40px">
                Back
              </ButtonEb>
            </Link>
          </>
        )}
      </Content>
    </Container>
  );
};

export default SurveyTexts;
