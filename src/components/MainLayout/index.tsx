import React from 'react';

import { Container, MainContent } from './styles';
import SideBar from '../SideBar';

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <Container>
      <SideBar name="Victor Neu" />
      <MainContent>{children}</MainContent>
    </Container>
  );
};

export default DashboardLayout;
