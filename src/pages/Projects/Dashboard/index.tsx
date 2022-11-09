import React from 'react';
import {
  EditOutlined,
  AssessmentOutlined,
  EmojiPeopleOutlined,
  AssignmentTurnedInOutlined,
} from '@material-ui/icons';
import { Link, useParams, useLocation } from 'react-router-dom';

import { Container, Content, BoxCard } from './styles';

interface ParamTypes {
  projectId: string;
}

interface Project {
  name: string;
  customerId: number;
  startYear: string;
  startMonth: string;
}

interface State {
  project: Project;
}

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<ParamTypes>();
  const { state } = useLocation<State>();

  return (
    <Container>
      <h1>{state?.project?.name}</h1>

      <Content>
        <BoxCard>
          <Link
            to={{
              pathname: `/surveys/project/${projectId}`,
              state: { projectName: state?.project?.name },
            }}
          >
            <AssignmentTurnedInOutlined />
            <h3>Surveys</h3>
          </Link>
        </BoxCard>

        <BoxCard>
          <Link to={`/projects/${projectId}/participation`}>
            <EmojiPeopleOutlined />
            <h3>Participations</h3>
          </Link>
        </BoxCard>

        <BoxCard>
          <Link
            to={{
              pathname: `/projects/${projectId}/analytics`,
              state: { project: state?.project },
            }}
          >
            <AssessmentOutlined />
            <h3>Analytics</h3>
          </Link>
        </BoxCard>

        <BoxCard>
          <Link to={`#`}>
            <EditOutlined />
            <h3>Properties</h3>
          </Link>
        </BoxCard>
      </Content>
    </Container>
  );
};

export default ProjectDashboard;
