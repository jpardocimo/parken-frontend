/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from 'react-router-dom';

import { ListAltOutlined, EditOutlined } from '@material-ui/icons';

import { FiLink, FiCheckCircle, FiLock, FiUnlock } from 'react-icons/fi';

import DuplicateButton from './duplicate';

import { StyledTooltip } from './styles';
import DeleteButton from './delete';

export const columns: any[] = [
  {
    name: 'accessId',
    title: 'ID',
  },
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'subgroup',
    title: 'User Group',
  },
  // {
  //   name: 'searchValue',
  //   title: 'Tag to be replaced',
  // },
  // {
  //   name: 'replaceValue',
  //   title: 'Value to replace',
  // },

  {
    name: 'segments',
    title: 'Segments',
    getCellValue: (row: any) =>
      row.segments && row.segments.length > 0 ? (
        <>
          <StyledTooltip
            title={row.segments.map((t: string, i: number) => {
              return <li key={i}>{t}</li>;
            })}
          >
            <div>
              <ListAltOutlined />
            </div>
          </StyledTooltip>
        </>
      ) : (
        <></>
      ),
  },
  {
    name: 'status',
    title: 'Status',
    width: 200,
    filter: false,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          {row.isLocked ? (
            <FiLock size={22} color={'#ff0000'} />
          ) : (
            <FiUnlock size={22} color={'#007f32'} />
          )}
        </>
      );

      return iconProperties;
    },
  },
  {
    name: 'finalLink',
    title: 'Final Link',
    width: 200,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <Link to={`/questionnaire/${row.accessId}`} target="_blank">
            <FiLink size={22} color={'#ff0000'} />
          </Link>
        </>
      );

      return iconProperties;
    },
  },
  {
    name: 'testLink',
    title: 'Test Link',
    width: 200,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <Link to={`/questionnaire/${row.accessId}?test=true`} target="_blank">
            <FiCheckCircle size={22} color={'#007f32'} />
          </Link>
        </>
      );

      return iconProperties;
    },
  },
  {
    name: 'duplicateAccess',
    title: 'Duplicate',
    width: 200,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <DuplicateButton
            access={{
              surveyId: row.surveyId,
              name: row.name,
              segments: row.segments,
              isLocked: row.isLocked,
              placeholders: row.placeholders,
            }}
          ></DuplicateButton>
        </>
      );

      return iconProperties;
    },
  },
  {
    name: 'edit',
    title: ' ',
    width: 200,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <Link
            to={{
              pathname: `/surveys/${row.surveyId}/accesses/edit/${row.accessId}`,
              state: {
                surveyName: row.surveyName,
                subgroup: row.subgroup,
              },
            }}
          >
            <EditOutlined />
          </Link>
        </>
      );

      return iconProperties;
    },
  },
  {
    name: 'delete',
    title: ' ',
    width: 200,
    getCellValue: (row: any) => {
      const iconProperties = (
        <>
          <DeleteButton
            access={{
              accessId: row.accessId,
              surveyId: row.surveyId,
              name: row.name,
              segments: row.segments,
              isLocked: row.isLocked,
            }}
          ></DeleteButton>
        </>
      );

      return iconProperties;
    },
  },
];
