import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactExport from 'react-export-excel';

import Select from 'react-select';
import moment from 'moment';
import Table from '../../../components/DevExpressTable/DevExpressTable';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';

import { Container, Content } from './styles';

import api from '../../../services/api';

const { ExcelFile } = ReactExport;
const { ExcelSheet } = ReactExport.ExcelFile;
const { ExcelColumn } = ReactExport.ExcelFile;

interface DownloadType {
  value: number;
  label: string;
}

const downloadTypes: DownloadType[] = [
  { value: 0, label: 'All Data' },
  { value: 1, label: 'Test Data' },
  { value: 2, label: 'Real Data' },
  { value: 3, label: 'Real Data ( >30% )' },
];

interface ParamTypes {
  surveyId: string;
}

interface Columns {
  name: string;
  title: string;
}

interface State {
  pageTitle: string;
}

const ExportResult: React.FC = () => {
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState<Columns[]>([]);
  const params = useParams<ParamTypes>();
  const { state } = useLocation<State>();
  const [pageTitle, setPageTitle] = useState<string>('');
  const date = moment().format('MM-DD-YYYY hh:mm:ss');

  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'resultId', title: 'ID', width: 100 },
    { columnName: 'Survey', title: 'Survey', width: 150 },
    { columnName: 'UserGroup', title: 'Survey', width: 170 },
    { columnName: 'StartTime', width: 200 },
    { columnName: 'EndTime', width: 200 },
    { columnName: 'Test', width: 100 },
  ]);

  const getResults = useCallback(
    (searchType: number) => {
      const paramsPost = { surveyId: params.surveyId, searchType };
      api.post(`/results/survey/export`, paramsPost).then(response => {
        if (response.data.length > 0) {
          const dynamicColumns: any[] = Object.keys(response.data[0])
            .filter(x => x !== 'results')
            .map(key => {
              if (key === 'resultId') {
                return {
                  name: key.trim() ?? '',
                  title: 'ID',
                };
              }
              return {
                name: key.trim() ?? '',
                title: key.trim() ?? '',
              };
            });

          const headerQuestionIds = response.data[0].results
            .filter((x: any) => x.questionId !== 'NaN')
            .map((result: any) => {
              return { name: result.questionId, title: result.questionId };
            });

          const headerQuestionIdsWithoutDuplicates: any[] = [];

          // removing repeated columns: TODO: FIX the backend for dont send duplicates to frontend
          headerQuestionIds.forEach((element: any) => {
            if (
              !headerQuestionIdsWithoutDuplicates.some(
                (x: any) =>
                  x.title === element.title && x.name === element.name,
              )
            ) {
              headerQuestionIdsWithoutDuplicates.push(element);
            }
          });

          response.data.forEach((row: { results: any[] }, index: number) => {
            row.results.forEach((element: any) => {
              response.data[index][element.questionId] = element.value;
            });
          });

          setColumns(dynamicColumns.concat(headerQuestionIdsWithoutDuplicates));

          if (state) {
            setPageTitle(state?.pageTitle);
          } else {
            const title = `${response.data[0].ProjectName} - ${response.data[0].Survey} - ${response.data[0].UserGroup}`;
            setPageTitle(title);
          }

          // sort list by last update:
          const resultsAux = response.data.map((obj: any) => {
            return { ...obj, date: new Date(obj.EndTime) };
          });

          const resultsSortedDesc = resultsAux.sort(
            (objA: any, objB: any) => objB.date.getTime() - objA.date.getTime(),
          );

          resultsSortedDesc.map((x: any) => {
            const y = x;
            y.StartTime = new Date(x.StartTime).toLocaleString();
            y.EndTime = new Date(x.EndTime).toLocaleString();
            return y;
          });

          setResults(resultsSortedDesc);
        } else {
          setResults([]);
        }
      });
    },
    [params.surveyId, state],
  );

  useEffect(() => {
    getResults(0);
  }, [getResults, params]);

  const handleDonwloadTypeChange = useCallback(
    (downloadType: any) => {
      getResults(downloadType.value);
    },
    [getResults],
  );

  return (
    <Container>
      <BackButton />

      <h1>Results</h1>
      <h2>{pageTitle}</h2>
      <br />

      <h3>Download Type</h3>
      <Select
        options={downloadTypes}
        onChange={e => handleDonwloadTypeChange(e)}
      />

      <ExcelFile
        element={
          <Button marginRight="35px" width="150px" height="40px">
            Download
          </Button>
        }
        filename={`ResultsForSurvey-${params.surveyId} - ${date}`}
      >
        <ExcelSheet data={results} name="Results">
          {columns.map(column => {
            return (
              <ExcelColumn
                key={column.title.trim()}
                label={column.title.trim()}
                value={column.name.trim()}
              />
            );
          })}
        </ExcelSheet>
      </ExcelFile>

      {columns.length > 0 && (
        <Content>
          <Table
            columnsProp={columns}
            dataProp={results}
            checkboxSelection={false}
            tableColumnExtensions={tableColumnExtensions}
            idName={'resultId'}
          ></Table>
        </Content>
      )}
    </Container>
  );
};

export default ExportResult;
