import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import MainLayout from '../components/MainLayout';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  isSurvey?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  isSurvey = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          isPrivate ? (
            <MainLayout>
              <Component />
            </MainLayout>
          ) : (
            <Component />
          )
        ) : isSurvey ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/projects',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
