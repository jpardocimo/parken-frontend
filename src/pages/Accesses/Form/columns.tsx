import { Column } from '@devexpress/dx-react-grid';

interface Result {
  resultId: number;
  accessId: number;
  code: string;
  createdByUser: boolean;
}

export const columns: Column[] = [
  {
    name: 'resultId',
    title: 'ID',
  },
  // {
  //   name: 'accessId',
  //   title: 'access',
  // },
  {
    name: 'surveyName',
    title: 'Survey',
  },
  {
    name: 'code',
    title: 'Code',
  },
  {
    name: 'segmentNames',
    title: 'Segments',
  },

  {
    name: 'linkName',
    title: 'Link Name',
  },
  {
    name: 'url',
    title: 'URL',
    // getCellValue: (row: Result): string => {
    //   return `${window.location.hostname}/questionnaire/${row.accessId}/${row.code}`;
    // },
  },
  {
    name: 'subgroup',
    title: 'User  Group',
  },
  {
    name: 'createdByUser',
    title: 'Created By User',
    getCellValue: (row: Result): string => {
      return row.createdByUser ? 'Yes' : 'No';
    },
  },
  { name: 'delete', title: '' },
];
