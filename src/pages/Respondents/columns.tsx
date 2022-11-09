interface Respondent {
  email: string;
  resultId: number;
  reportAcceptance: boolean;
  newsletterAcceptance: boolean;
  created_at: Date;
}

export const columns: any[] = [
  {
    name: 'respondentId',
    title: 'ID',
  },
  {
    name: 'code',
    title: 'Code',
  },
  {
    name: 'email',
    title: 'E-mail',
  },
  {
    name: 'projectName',
    title: 'Project Name',
  },
  {
    name: 'surveyName',
    title: 'Survey Name',
  },
  {
    name: 'reportAcceptance',
    title: 'Send Report?',
    getCellValue: (row: Respondent) => (row.reportAcceptance ? 'Yes' : 'No'),
  },
  {
    name: 'created_at',
    title: 'Inserted Date',
    getCellValue: (row: Respondent) => row.created_at,
  },
];
