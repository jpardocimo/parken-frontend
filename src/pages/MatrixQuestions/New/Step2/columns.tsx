/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { LabelOutlined, ListAltOutlined } from '@material-ui/icons';

import { StyledTooltip } from './styles';

interface Option {
  label: string;
  text: string;
}

interface Tag {
  label: string;
  text: string;
}

export const columns: any[] = [
  {
    name: 'questionId',
    title: 'ID',
  },
  {
    name: 'externalId',
    title: 'External ID',
  },
  {
    name: 'text',
    title: 'Texts',
  },
  {
    name: 'options',
    title: 'Option',
    getCellValue: (row: any) =>
      row.options && row.options.length > 0 ? (
        <>
          <StyledTooltip
            title={row.options.map((t: Option, i: number) => {
              return <li key={i}>{t.text}</li>;
            })}
          >
            <ListAltOutlined />
          </StyledTooltip>
        </>
      ) : (
        <></>
      ),
  },
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'tags',
    title: 'Tags',
    getCellValue: (row: any) =>
      row.tags && row.tags.length > 0 ? (
        <>
          <StyledTooltip
            title={row.tags.map((t: Option, i: number) => {
              return <li key={i}>{t}</li>;
            })}
          >
            <LabelOutlined />
          </StyledTooltip>
        </>
      ) : (
        <></>
      ),
  },
];
