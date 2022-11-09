import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';

import {
  FiSettings,
  FiBookOpen,
  FiList,
  FiPower,
  FiPackage,
  FiCode,
  FiDollarSign,
  FiSmile,
  FiMail,
} from 'react-icons/fi';

import 'react-pro-sidebar/dist/css/styles.css';
import {
  SidebarHeaderCustom,
  SidebarHeaderContent,
  SidebarFooterContent,
  Button,
} from './styles';

import { useAuth } from '../../hooks/auth';

import sidebarBg from '../../assets/menu-background.jpg';
import logoImg from '../../assets/eb-logo-white.png';

interface SideBarProps {
  name: string;
}

const SideBar: React.FC<SideBarProps> = ({ name, ...rest }) => {
  const { signOut } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<string>();

  useEffect(() => {
    setCurrentLocation(window.location.pathname);
  }, []);

  const handleMenuClick = useCallback(() => {
    setCurrentLocation(window.location.pathname);
  }, []);

  return (
    <ProSidebar image={sidebarBg} width="240px">
      <SidebarHeaderCustom>
        <SidebarHeaderContent>{name}</SidebarHeaderContent>
        <Button type="button" onClick={signOut}>
          <FiPower color={'#fff'} size={20} />
        </Button>
      </SidebarHeaderCustom>

      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title="Questions" icon={<FiBookOpen />}>
            <MenuItem
              active={currentLocation === '/questions/new'}
              onClick={handleMenuClick}
            >
              New Question
              <Link to="/questions/new" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/questions'}
              onClick={handleMenuClick}
            >
              List
              <Link to="/questions" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/questions/translations'}
              onClick={handleMenuClick}
            >
              Translations
              <Link to="/questions/translations" />
            </MenuItem>
          </SubMenu>

          <SubMenu title="Customers" icon={<FiDollarSign />}>
            <MenuItem
              active={currentLocation === '/customers/new'}
              onClick={handleMenuClick}
            >
              New Customer
              <Link to="/customers/new" />
            </MenuItem>

            <MenuItem
              active={currentLocation === '/customers'}
              onClick={handleMenuClick}
            >
              List
              <Link to="/customers" />
            </MenuItem>
          </SubMenu>

          <SubMenu title="Projects" icon={<FiSmile />}>
            <MenuItem
              active={currentLocation === '/projects/new'}
              onClick={handleMenuClick}
            >
              New Project
              <Link to="/projects/new" />
            </MenuItem>

            <MenuItem
              active={currentLocation === '/projects'}
              onClick={handleMenuClick}
            >
              List
              <Link to="/projects" />
            </MenuItem>
          </SubMenu>

          <SubMenu title="Surveys" icon={<FiList />}>
            <MenuItem
              active={currentLocation === '/surveys/new'}
              onClick={handleMenuClick}
            >
              New Survey
              <Link
                to={{
                  pathname: `/surveys/new`,
                  state: { projectId: undefined },
                }}
              />
            </MenuItem>

            <MenuItem
              active={currentLocation === '/surveys'}
              onClick={handleMenuClick}
            >
              List
              <Link to="/surveys" />
            </MenuItem>
          </SubMenu>

          <SubMenu title="Products" icon={<FiPackage />}>
            <MenuItem
              active={currentLocation === '/products/new'}
              onClick={handleMenuClick}
            >
              New Product
              <Link to="/products/new" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/products/surveyTemplate'}
              onClick={handleMenuClick}
            >
              Survey Templates
              <Link to="/products/surveyTemplate" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/products'}
              onClick={handleMenuClick}
            >
              Structures
              <Link to="/products" />
            </MenuItem>
          </SubMenu>

          <SubMenu title="Customization" icon={<FiCode />}>
            <MenuItem
              active={currentLocation === '/surveyTexts/type/start'}
              onClick={handleMenuClick}
            >
              Start Texts
              <Link to="/surveyTexts/type/start" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/surveyTexts/type/final'}
              onClick={handleMenuClick}
            >
              Final Texts
              <Link to="/surveyTexts/type/final" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/logos'}
              onClick={handleMenuClick}
            >
              Logos
              <Link to="/logos" />
            </MenuItem>
            <MenuItem
              active={currentLocation === '/images'}
              onClick={handleMenuClick}
            >
              Images
              <Link to="/images" />
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<FiMail />}
            active={currentLocation === '/respondents'}
            onClick={handleMenuClick}
          >
            Respondent EMails
            <Link to="/respondents" />
          </MenuItem>

          {/* <MenuItem
            icon={<FiSettings />}
            active={currentLocation === '/languageSettings'}
            onClick={handleMenuClick}
          >
            Settings
            <Link to="/languageSettings" />
          </MenuItem> */}
        </Menu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterContent>
          <img src={logoImg} alt="Victor" width="200" />
        </SidebarFooterContent>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default SideBar;
