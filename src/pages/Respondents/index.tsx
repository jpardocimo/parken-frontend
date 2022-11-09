import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import Table from '../../components/DevExpressTable/DevExpressTable';
import { columns } from './columns';

import { Container, Content } from './styles';

interface Respondent {
  created_at: string;
  respondentId: number;
  email: string;
}

const Respondents: React.FC = () => {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'respondentId', width: 120 },
    { columnName: 'code', width: 78 },
    { columnName: 'email', width: 370 },
    { columnName: 'projectName', width: 280 },
    { columnName: 'surveyName', width: 280 },
    { columnName: 'reportAcceptance', width: 150 },
    // { columnName: 'newsletterAcceptance', width: 180 },
    { columnName: 'created_at', width: 200 },
  ]);

  useEffect(() => {
    api.get('respondents').then(response => {
      response.data.map((r: Respondent) => {
        const respondentDataLocalUser = r;
        respondentDataLocalUser.created_at = new Date(
          r.created_at,
        ).toLocaleString();
        return respondentDataLocalUser;
      });

      setRespondents(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Respondents E-mails</h1>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={respondents}
          checkboxSelection={false}
          tableColumnExtensions={tableColumnExtensions}
          hasFilterRow={true}
          idName={'respondentId'}
        ></Table>
      </Content>
    </Container>
  );
};

export default Respondents;
