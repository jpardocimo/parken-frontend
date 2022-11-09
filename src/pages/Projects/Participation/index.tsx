import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactExport from 'react-export-excel';

import moment from 'moment';
import Button from '../../../components/Button';

import api from '../../../services/api';

import {
  Container,
  Content,
  BoxContent,
  BoxCard,
  BoxRow,
  BoxCol,
  FilterSelect,
} from './styles';

const { ExcelFile } = ReactExport;
const { ExcelSheet } = ReactExport.ExcelFile;
const { ExcelColumn } = ReactExport.ExcelFile;

interface ParamTypes {
  projectId: string;
}

interface Columns {
  name: string;
  title: string;
}

interface Result {
  resultId: number;
  surveyId: number;
  surveyName: string;
  lastUpdate: string;
  // hour: string;
  surveyUserGroup: string;
  progress: string;
  segments: string;
  accessName: string;
}

interface Participation {
  // totalResults: number;
  totalPeopleStartedSurvey: number;
  totalPeople30OrMore: number;
  // totalPeopleCompletedSurvey: number;
  totalPeople0OrMore: number;
  results: Result[];
}

interface ExcelData {
  // date: string;
  // totalResults: number;
  totalPeopleStartedSurvey: number;
  totalPeople30OrMore: number;
  // totalPeopleCompletedSurvey: number;
  totalPeople0OrMore: number;
  selectedSurvey: string;
  selectedUserGroup: string;
  selectedSegments: string;
  selectedLink: string;
}

const ProjectParticipation: React.FC = () => {
  const { projectId } = useParams<ParamTypes>();
  const [columns, setColumns] = useState<Columns[]>([]);

  const [participations, setParticipations] = useState<Participation>();
  const [participationsStore, setParticipationsStore] =
    useState<Participation>();
  const [selectSurveyOptions, setSelectSurveyOptions] = useState<string[]>([]);
  const [selectAccessOptions, setSelectAccessOptions] = useState<string[]>([]);
  const [selectUserGroupOptions, setSelectUserGroupOptions] = useState<
    string[]
  >([]);
  const [selectSegmentsOptions, setSelectSegmentsOptions] = useState<string[]>(
    [],
  );
  const [selectedSurvey, setSelectedSurvey] = useState<string>('all');
  const [selectedUserGroup, setSelectedUserGroup] = useState<string>('all');
  const [selectedSegments, setSelectedSegments] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');

  const [dataExcel, setDataExcel] = useState<ExcelData[]>();
  const [title, setTitle] = useState<string>('');

  const [date, setDate] = useState<string>('');

  useEffect(() => {
    api.get(`/results/project/${projectId}`).then(response => {
      const p: Participation = response.data;

      // sort list by last update:
      const resultsListAux = p.results.map((obj: any) => {
        return { ...obj, date: new Date(obj.lastUpdate) };
      });

      const sortedDesc = resultsListAux.sort(
        (objA, objB) => objB.date.getTime() - objA.date.getTime(),
      );

      p.results = sortedDesc.map((x: Result) => {
        const y: Result = x;
        y.lastUpdate = new Date(x.lastUpdate).toLocaleString();
        return y;
      });

      setParticipations(p);
      setParticipationsStore(p);
      setTitle(response.data.projectName);
    });
  }, [projectId]);

  useEffect(() => {
    const surveyNameList = participationsStore?.results.flatMap(x => {
      return x.surveyName;
    });
    const uniqueSurveyName = [...new Set(surveyNameList)];
    uniqueSurveyName.push('all');
    setSelectSurveyOptions(uniqueSurveyName);

    const accessNameList = participationsStore?.results.flatMap(x => {
      return x.accessName;
    });

    const uniqueAccessName = [...new Set(accessNameList)];
    uniqueAccessName.push('all');
    setSelectAccessOptions(uniqueAccessName);

    const userGroupList = participationsStore?.results.flatMap(x => {
      return x.surveyUserGroup;
    });
    const uniqueUserGroup = [...new Set(userGroupList)];
    uniqueUserGroup.push('all');
    setSelectUserGroupOptions(uniqueUserGroup);

    const segmentsList = participationsStore?.results.flatMap(x => {
      return x.segments;
    });
    const uniqueSegments = [...new Set(segmentsList)];
    uniqueSegments.push('all');
    setSelectSegmentsOptions(uniqueSegments);

    const dateToset = moment().format('DD-MM-YYYY hh:mm:ss');
    const columnsTosetExcel: Columns[] = [
      // { name: 'date', title: 'Date' },
      { name: 'selectedSurvey', title: 'Survey' },
      { name: 'selectedLink', title: 'Link' },
      { name: 'selectedUserGroup', title: 'User Groups' },
      { name: 'selectedSegments', title: 'Segments' },
      // { name: 'accessName', title: 'accessName' },
      // { name: 'totalResults', title: 'Total' },
      {
        name: 'totalPeopleStartedSurvey',
        title: 'Less than 30%',
      },
      { name: 'totalPeople30OrMore', title: '30 % or more' },
      {
        name: 'totalPeople0OrMore',
        title: 'Total',
      },
    ];

    const dataListExcel: ExcelData[] = [];

    uniqueSurveyName.sort().forEach(survey => {
      uniqueAccessName.sort().forEach(link => {
        uniqueUserGroup.sort().forEach(userGroup => {
          uniqueSegments.sort().forEach(segment => {
            let resultsFiltered = participationsStore?.results;

            if (segment !== 'all') {
              resultsFiltered = resultsFiltered?.filter(x =>
                x.segments.includes(segment),
              );
            }

            if (survey !== 'all') {
              resultsFiltered = resultsFiltered?.filter(
                x => x.surveyName === survey,
              );
            }

            if (userGroup !== 'all') {
              resultsFiltered = resultsFiltered?.filter(
                x => x.surveyUserGroup === userGroup,
              );
            }
            if (link !== 'all') {
              resultsFiltered = resultsFiltered?.filter(
                x => x.accessName === link,
              );
            }

            if (resultsFiltered) {
              const participationfiltered: Participation = {
                // totalResults: resultsFiltered.length,
                totalPeopleStartedSurvey: resultsFiltered.filter(
                  x =>
                    Number(x.progress.replace(/[^0-9]/g, '')) > 0 &&
                    Number(x.progress.replace(/[^0-9]/g, '')) < 30,
                ).length,
                totalPeople30OrMore: resultsFiltered.filter(
                  x => Number(x.progress.replace(/[^0-9]/g, '')) >= 30,
                ).length,
                totalPeople0OrMore: resultsFiltered.filter(
                  x => Number(x.progress.replace(/[^0-9]/g, '')) > 0,
                ).length,
                results: resultsFiltered,
              };

              const dataTosetExcel: ExcelData = {
                // date,
                // totalResults: participationfiltered.totalResults,
                totalPeopleStartedSurvey:
                  participationfiltered.totalPeopleStartedSurvey,
                totalPeople30OrMore: participationfiltered.totalPeople30OrMore,
                totalPeople0OrMore: participationfiltered.totalPeople0OrMore,
                selectedSegments: segment,
                selectedLink: link,
                selectedUserGroup: userGroup,
                selectedSurvey: survey,
              };

              dataListExcel.push(dataTosetExcel);
            }
          });
        });
      });
    });

    setDate(dateToset);
    setColumns(columnsTosetExcel);
    setDataExcel(dataListExcel);
  }, [date, participationsStore?.results]);

  useEffect(() => {
    let resultsFiltered = participationsStore?.results;

    if (selectedSegments !== 'all') {
      resultsFiltered = resultsFiltered?.filter(x =>
        x.segments.includes(selectedSegments),
      );
    }

    if (selectedSurvey !== 'all') {
      resultsFiltered = resultsFiltered?.filter(
        x => x.surveyName === selectedSurvey,
      );
    }

    if (selectedAccess !== 'all') {
      resultsFiltered = resultsFiltered?.filter(
        x => x.accessName === selectedAccess,
      );
    }

    if (selectedUserGroup !== 'all') {
      resultsFiltered = resultsFiltered?.filter(
        x => x.surveyUserGroup === selectedUserGroup,
      );
    }

    if (resultsFiltered) {
      const participationfiltered: Participation = {
        // totalResults: resultsFiltered.length,
        totalPeopleStartedSurvey: resultsFiltered.filter(
          x =>
            Number(x.progress.replace(/[^0-9]/g, '')) > 0 &&
            Number(x.progress.replace(/[^0-9]/g, '')) < 30,
        ).length,
        totalPeople30OrMore: resultsFiltered.filter(
          x => Number(x.progress.replace(/[^0-9]/g, '')) >= 30,
        ).length,
        totalPeople0OrMore: resultsFiltered.filter(
          x => Number(x.progress.replace(/[^0-9]/g, '')) > 0,
        ).length,
        results: resultsFiltered,
      };

      setParticipations(participationfiltered);
    }
  }, [
    participationsStore?.results,
    selectedAccess,
    selectedSegments,
    selectedSurvey,
    selectedUserGroup,
  ]);

  const handleSelectSurvey = useCallback(value => {
    setSelectedSurvey(value.target.value);
  }, []);

  const handleSelectAccess = useCallback(value => {
    setSelectedAccess(value.target.value);
  }, []);

  const handleSelectUserGroup = useCallback(value => {
    setSelectedUserGroup(value.target.value);
  }, []);

  const handleSelectSegments = useCallback(value => {
    setSelectedSegments(value.target.value);
  }, []);

  return (
    <>
      {title !== '' && <h1 style={{ textAlign: 'center' }}>{title}</h1>}
      {participations && (
        <Container>
          <Content>
            <FilterSelect>
              <FormControl fullWidth>
                <InputLabel id="select-survey">Survey</InputLabel>
                <Select
                  labelId="demo-survey"
                  id="demo-simple-select"
                  onChange={handleSelectSurvey}
                >
                  {/* <MenuItem key="allSurveys" value="all">
                    all
                  </MenuItem> */}
                  {selectSurveyOptions.map(element => {
                    return (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </FilterSelect>

            <FilterSelect>
              <FormControl fullWidth>
                <InputLabel id="select-access">Link</InputLabel>
                <Select
                  labelId="demo-access"
                  id="demo-simple-select-access"
                  onChange={handleSelectAccess}
                >
                  {/* <MenuItem key="allSurveys" value="all">
                    all
                  </MenuItem> */}
                  {selectAccessOptions.map(element => {
                    return (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </FilterSelect>

            <FilterSelect>
              <FormControl fullWidth>
                <InputLabel id="select-userGroup">UserGroup</InputLabel>
                <Select
                  id="demo-simple-select-userGroup"
                  onChange={handleSelectUserGroup}
                >
                  {/* <MenuItem key="allUserGroups" value="all">
                    all
                  </MenuItem> */}
                  {selectUserGroupOptions.map(element => {
                    return (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </FilterSelect>

            <FilterSelect>
              <FormControl fullWidth>
                <InputLabel id="select-segments">Segments</InputLabel>
                <Select
                  labelId="demo-segments"
                  id="demo-simple-select-segments"
                  onChange={handleSelectSegments}
                >
                  {/* <MenuItem key="allSegments" value="all">
                    all
                  </MenuItem> */}
                  {selectSegmentsOptions.map(element => {
                    return (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </FilterSelect>
          </Content>
          <h1>Participations</h1>
          <Content>
            {/* <BoxCard color={'#E8EFF9'}>
              <h3>{participations?.totalResults}</h3>
              <span>Total results</span>
            </BoxCard> */}

            <BoxCard color={'#FFEFE7'}>
              <h3>{participations?.totalPeopleStartedSurvey}</h3>
              <span>Total people who started the survey</span>
            </BoxCard>

            <BoxCard color={'#fffdd0'}>
              <h3>{participations?.totalPeople30OrMore}</h3>
              <span>Total people with 30% or more</span>
            </BoxCard>

            <BoxCard color={'#EBFDEF'}>
              <h3>{participations?.totalPeople0OrMore}</h3>
              <span>Total</span>
            </BoxCard>
          </Content>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ExcelFile
              element={
                <Button marginRight="35px" width="150px" height="40px">
                  Download
                </Button>
              }
              filename={`${title} - Participants - ${date}}`}
            >
              <ExcelSheet data={dataExcel} name="participations">
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
          </div>
          <br />
          <br />

          <h1>Last Respondents</h1>

          <BoxContent>
            <BoxRow>
              {/* <BoxCol>IdResult</BoxCol> */}
              <BoxCol>Survey</BoxCol>
              <BoxCol>Link</BoxCol>
              <BoxCol>User Group</BoxCol>
              <BoxCol>Segments</BoxCol>
              <BoxCol>Date</BoxCol>
              {/* <BoxCol>Hour</BoxCol> */}
              <BoxCol>Progress</BoxCol>
            </BoxRow>

            {participations?.results
              .filter(x => Number(x.progress.replace(/[^0-9]/g, '')) > 0)
              .slice(0, 10)
              .map(result => (
                <BoxRow key={result.resultId}>
                  {/* <BoxCol>{result.resultId}</BoxCol> */}
                  <BoxCol>{result.surveyName}</BoxCol>
                  <BoxCol>{result.accessName}</BoxCol>
                  <BoxCol>{result.surveyUserGroup}</BoxCol>
                  <BoxCol>{result.segments}</BoxCol>
                  <BoxCol>{result.lastUpdate}</BoxCol>
                  {/* <BoxCol>{result.hour}</BoxCol> */}
                  <BoxCol>{result.progress}</BoxCol>
                </BoxRow>
              ))}
          </BoxContent>
        </Container>
      )}
    </>
  );
};

export default ProjectParticipation;
