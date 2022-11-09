import styled from 'styled-components';
import { SidebarHeader } from 'react-pro-sidebar';

export const SidebarHeaderCustom = styled(SidebarHeader)`
  display: flex;
  align-items: center;
`;

export const SidebarHeaderContent = styled.div`
  padding: 24px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const Button = styled.button`
  border: 0 none;
  background-color: transparent;
  margin: 0 24px;

  &:hover {
    opacity: 0.7;
  }
`;

export const SidebarFooterContent = styled.div`
  padding: 20px 24px;
  text-align: center;
`;
