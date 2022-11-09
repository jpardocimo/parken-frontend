import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { EditOutlined, Lock, LockOpen } from '@material-ui/icons';

import { columns } from './columns';
import { Container, Content, Button } from './styles';
import api from '../../services/api';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';
import Table from '../../components/DevExpressTable/DevExpressTable';

interface Survey {
  surveyId: number;
  title: string;
  name: string;
  isLocked: boolean;
  isLockedIcon: React.ReactElement<any>;
}
interface ParamTypes {
  projectId: string;
}

interface State {
  projectName: string;
}

const Surveys: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { projectId } = useParams<ParamTypes>();
  const { state } = useLocation<State>();
  const [tableColumnExtensions] = useState([
    { columnName: 'isLockedIcon', width: 110 },
    { columnName: 'surveyId', width: 60 },
    { columnName: 'projectName', width: 180 },
    { columnName: 'name', width: 370 },
    { columnName: 'title', width: 370 },
    { columnName: 'subGroup', width: 200 },
    { columnName: 'edit', width: 110 },
  ]);

  const handleClickEdit = useCallback(
    (row: any) => {
      history.push(`/surveys/${row.surveyId}`);
    },
    [history],
  );

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'edit',
      label: 'Edit',
      onClick: handleClickEdit,
      icon: <EditOutlined />,
    },
  ]);

  useEffect(() => {
    setLoading(true);

    const requestUrl = projectId ? `/surveys/project/${projectId}` : '/surveys';

    api.get(requestUrl).then(response => {
      const surveysResponse = response.data.map((x: Survey) => {
        return {
          ...x,
          isLockedIcon: !x.isLocked ? <LockOpen /> : <Lock />,
        };
      });

      setSurveys(surveysResponse);
      // setProjectName(surveysResponse[0].projectName);
    });

    setLoading(false);
  }, [projectId]);

  return (
    <Container className={loading ? 'loading' : ''}>
      {state?.projectName ? (
        <>
          <h1>{state?.projectName} - Surveys</h1>
        </>
      ) : (
        <h1>Surveys</h1>
      )}

      <Link
        to={{
          pathname: `/surveys/new`,
          state: { projectId },
        }}
      >
        <Button variant="contained" type="button">
          New Survey
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={surveys}
          checkboxSelection={false}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'surveyId'}
        ></Table>
      </Content>
    </Container>
  );
};

export default Surveys;
