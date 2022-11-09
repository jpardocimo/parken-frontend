import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';
import Table from '../../components/DevExpressTable/DevExpressTable';
import { columns } from './columns';

import { Container, Content, Button, EditIcon, PropertiesIcon } from './styles';

interface Project {
  projectId: number;
  name: string;
  startYear: string;
  startMonth: string;
}

const Projects: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'projectId', width: 120 },
    { columnName: 'name', width: 370 },
    { columnName: 'customerName', width: 370 },
    { columnName: 'startYear', width: 110 },
    { columnName: 'edit', width: 110 },
    { columnName: 'settings', width: 80 },
  ]);

  const handleClickEdit = useCallback(
    (row: any) => {
      history.push(`/projects/edit/${row.projectId}`);
    },
    [history],
  );

  const handleClickSettings = useCallback(
    (row: any) => {
      history.push({
        pathname: `/projects/${row.projectId}/dashboard`,
        state: { project: row },
      });
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
    {
      columnName: 'settings',
      label: '',
      onClick: handleClickSettings,
      icon: <PropertiesIcon />,
    },
  ]);

  useEffect(() => {
    setLoading(true);
    api.get('projects').then(response => {
      setProjects(response.data);
    });
    setLoading(false);
  }, []);

  return (
    <Container className={loading ? 'loading' : ''}>
      <h1>Projects</h1>

      <Link to="/projects/new">
        <Button variant="contained" type="button">
          New Project
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={projects}
          checkboxSelection={false}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'projectId'}
        ></Table>
      </Content>
    </Container>
  );
};

export default Projects;
