/* eslint-disable eqeqeq */
import { Tab, Tabs } from '@material-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SelectMultipleBartChart from '../../../components/Charts/BarChart';
import StackedBarPercentageResults from '../../../components/Charts/StackedBarPercentageResult';
import StandardDeviation from '../../../components/Charts/StandardDeviation';
import Select from '../../../components/SelectForm';
import api from '../../../services/api';
import StructureKpi from './StructureKpi';

import {
  DashboardContainer,
  DashboardHeader,
  HeaderTitle,
  DashboardChartBox,
  DashBoardChartsContent,
  DashoboardFilterBox,
  DashboardFilterContent,
  ContainerEmpty,
} from './styles';

interface Kpi {
  name: string;
  score: number;
  category: string;
  topics: Kpi[];
  scoreBenchmark?: number;
  questionId?: number;
}

interface ScaleCharts {
  standardDeviationList: StandardDeviationData[];
  PercentageByOption: any[];
}

interface Survey {
  surveyId: number;
  title: string;
}

interface Question {
  questionId: number;
  matrixId?: number;
  questionTitle: string;
  matrixTitle?: string;
  type: string;
  questionIdListKpi?: number[];
}

interface StandardDeviationData {
  questionTitle: string;
  questionId: number;
  standardDeviation: number;
  median: number;
  average: number;
}

interface Project {
  name: string;
  customerId: number;
  startYear: string;
  startMonth: string;
  projectId: string;
}

interface ParamTypes {
  projectId: string;
}

interface State {
  project: Project;
}

interface Tab {
  index: number;
}

function GetListQuestionByKpis(kpiValue: Kpi): Question[] {
  if (kpiValue.category === 'Question') return [];
  if (kpiValue.topics?.some(t => t.category === 'Question')) {
    const retorno: Question[] = [];
    const listIds: number[] = [];
    kpiValue.topics.forEach(t => {
      if (t.questionId !== undefined) listIds.push(t.questionId);
    });
    retorno.push({
      questionId: 0,
      questionTitle: `[KPI] - ${kpiValue.name}`,
      type: 'Kpi',
      questionIdListKpi: listIds,
    });
    return retorno;
  }
  let questionsFilhos: Question[] = [];
  kpiValue?.topics.forEach(t => {
    questionsFilhos = questionsFilhos.concat(GetListQuestionByKpis(t));
  });

  let questionIdListKpiFilhos: number[] = [];
  questionsFilhos.forEach(x => {
    if (x.questionIdListKpi) {
      questionIdListKpiFilhos = questionIdListKpiFilhos.concat(
        x.questionIdListKpi,
      );
    }
  });

  const question: Question = {
    questionId: 0,
    questionTitle: `[KPI] - ${kpiValue.name}`,
    type: 'Kpi',
    questionIdListKpi: questionIdListKpiFilhos,
  };
  questionsFilhos.push(question);
  return questionsFilhos;
}

let kpisFromSurvey: Kpi[] = [];

const ProjectAnalytics: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { projectId } = useParams<ParamTypes>();
  const { state } = useLocation<State>();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveyId, setSurveyId] = useState<number>(0);
  const [questionId, setQuestionId] = useState<number>(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [selectedTab, setSelectedTab] = useState<string>('analytics');

  const [standardDeviationList, setStandardDeviationList] = useState<
    StandardDeviationData[]
  >([]);

  const [stackedBarPercentageData, setStackedBarPercentageData] = useState<
    any[]
  >([]);

  const [selectOneOrMultipleBarData, setSelectOneOrMultipleBarData] = useState<
    any[]
  >([]);

  const [scaleChartList, setScaleChartList] = useState<ScaleCharts[]>([]);

  useEffect(() => {
    api.get(`/questions/survey/${surveyId}`).then(response => {
      const questionsFromSurvey: any[] = response.data;
      const questionsResults: Question[] = [];
      if (questionsFromSurvey.length > 1) {
        questionsFromSurvey?.forEach((element: any) => {
          const existMatrix = questionsResults.some(
            questionResult => questionResult.matrixId == element.matrixId,
          );
          const existQuestion = questionsResults.some(
            questionResult => questionResult.questionId == element.questionId,
          );
          if (element.matrixId && element.matrixTitle && !existMatrix) {
            questionsResults.push({
              matrixId: element.matrixId,
              matrixTitle: element.matrixTitle,
              questionId: element.matrixId,
              questionTitle: `[Matrix] - ${element.matrixTitle}`,
              type: 'Matrix',
            });
          } else if (element.matrixId) {
            if (!existQuestion) {
              questionsResults.push({
                matrixId: element.matrixId,
                matrixTitle: element.matrixTitle,
                questionId: element.questionId,
                questionTitle: `[Question] - ${element.questionTitle} - [Matrix - ${element.matrixId}]`,
                type: element.type,
              });
            }
          } else if (!existQuestion) {
            questionsResults.push({
              questionId: element.questionId,
              questionTitle: `[Question] - ${element.questionTitle}`,
              type: element.type,
            });
          }
        });
      }

      api.get(`/results/survey/${surveyId}/scoreResults`).then(responseKpi => {
        kpisFromSurvey = responseKpi.data;
        if (kpisFromSurvey?.length > 0) {
          kpisFromSurvey.forEach(kpiValue => {
            setQuestions(
              questionsResults.concat(GetListQuestionByKpis(kpiValue)),
            );
          });
        }
      });
      setQuestions(questionsResults);
    });
  }, [surveyId]);

  useEffect(() => {
    api.get(`/surveys/project/${projectId}`).then(response => {
      setSurveys(response.data);
    });
  }, [projectId]);

  const handleSelectSurveyChange = useCallback(value => {
    setSurveyId(value);
    setScaleChartList([]);

    // todo: clean SelectQuestion
    // todo: call select survey dropdown here
  }, []);

  const handleSelectSurveyQuestion = useCallback(
    value => {
      setQuestionId(value);
      const selectedQuestionFiltered =
        value.value === 0
          ? questions.find(question => question.questionTitle === value.label)
          : questions.find(question => question.questionId === value.value);

      setSelectedQuestion(selectedQuestionFiltered);
      setScaleChartList([]);
      const questionIdParam = value;
      const surveyIdParam = surveyId;

      switch (selectedQuestionFiltered?.type) {
        case 'Kpi':
          api
            .get(
              `/questions/listQuestionGroupedByOptions/${selectedQuestionFiltered.questionIdListKpi}`,
            )
            .then(response => {
              const scaleChartTestList: ScaleCharts[] = [];

              response.data.forEach((listQuestions: any[]) => {
                // eslint-disable-next-line no-case-declarations
                const scaleChartTestAux: ScaleCharts = {
                  PercentageByOption: [],
                  standardDeviationList: [],
                };

                api
                  .get(`/charts/std/${surveyIdParam}/0/kpi/${listQuestions}`)
                  .then(responseD => {
                    scaleChartTestAux.standardDeviationList = responseD.data;
                    setStandardDeviationList(responseD.data);
                  });

                api
                  .get(
                    `/charts/stackedBarResultPercentage/${surveyIdParam}/0/kpi/${listQuestions}`,
                  )
                  .then(responseE => {
                    scaleChartTestAux.PercentageByOption = responseE.data;
                    setStackedBarPercentageData(responseE.data);
                  });

                scaleChartTestList.push(scaleChartTestAux);

                setScaleChartList(scaleChartTestList);
              });
            });

          break;
        case 'SelectMultiple':
        case 'SelectOne':
          api
            .get(
              `/charts/getSelectOneOrMultipleChart/${surveyIdParam}/${selectedQuestionFiltered.questionId}`,
            )
            .then(response => {
              setSelectOneOrMultipleBarData(response.data);
            });
          break;

        case 'Scale':
          api
            .get(`/charts/std/${surveyIdParam}/${questionIdParam.value}/scale`)
            .then(response => {
              setStandardDeviationList(response.data);
            });

          api
            .get(
              `/charts/stackedBarResultPercentage/${surveyIdParam}/${questionIdParam.value}/scale`,
            )
            .then(response => {
              setStackedBarPercentageData(response.data);
            });
          break;

        case 'Matrix':
          api
            .get(`/charts/std/${surveyIdParam}/${questionIdParam.value}/matrix`)
            .then(response => {
              setStandardDeviationList(response.data);
            });

          api
            .get(
              `/charts/stackedBarResultPercentage/${surveyIdParam}/${questionIdParam.value}/matrix`,
            )
            .then(response => {
              setStackedBarPercentageData(response.data);
            });
          break;
        default:
          break;
      }
    },

    [questions, surveyId],
  );

  const handleSetSelectedTab = (
    event: ChangeEvent<any>,
    newValue: string,
  ): void => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <h1>Analytics</h1>

      <DashboardContainer>
        <DashboardHeader>
          <HeaderTitle>
            <p>{state?.project?.name}</p>
          </HeaderTitle>
        </DashboardHeader>

        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleSetSelectedTab}
        >
          <Tab value="kpis" label="KPIS" />
          <Tab value="analytics" label="Analytics" />
        </Tabs>

        <DashboardFilterContent>
          <DashoboardFilterBox>
            <Form
              ref={formRef}
              initialData={[{ value: 0, text: '' }]}
              onSubmit={() => {}}
            >
              <div>
                <p>Select Survey </p>
                <Select
                  name={'filterSurvey'}
                  options={
                    surveys &&
                    surveys.map((survey: Survey) => {
                      return { value: survey.surveyId, label: survey.title };
                    })
                  }
                  onChange={option => handleSelectSurveyChange(option?.value)}
                  isDisabled={false}
                />
              </div>
            </Form>
          </DashoboardFilterBox>

          {selectedTab !== 'kpis' && (
            <DashoboardFilterBox>
              <Form
                ref={formRef}
                initialData={[{ value: 0, text: '' }]}
                onSubmit={() => {}}
              >
                <div>
                  <p>Select Question </p>
                  <Select
                    name={'filterQuestion'}
                    options={
                      questions &&
                      questions?.map(question => {
                        return {
                          value: question.questionId,
                          label: question.questionTitle,
                        };
                      })
                    }
                    isDisabled={false}
                    onChange={option => handleSelectSurveyQuestion(option)}
                  />
                </div>
              </Form>
            </DashoboardFilterBox>
          )}
        </DashboardFilterContent>

        {selectedTab !== 'kpis' && (
          <>
            {surveyId !== 0 && questionId !== 0 ? (
              <DashBoardChartsContent>
                {selectedQuestion &&
                selectedQuestion.type !== 'SelectMultiple' &&
                selectedQuestion.type !== 'SelectOne' ? (
                  selectedQuestion.type === 'Kpi' ? (
                    scaleChartList.length > 0 && (
                      <>
                        {scaleChartList.map(value => {
                          return (
                            <>
                              <DashboardChartBox>
                                <HeaderTitle>
                                  <p>Percentage by Option</p>
                                </HeaderTitle>

                                <StackedBarPercentageResults
                                  dataSet={value.PercentageByOption}
                                />
                              </DashboardChartBox>

                              <DashboardChartBox>
                                <HeaderTitle>
                                  <p>Standard Deviation </p>
                                </HeaderTitle>
                                <StandardDeviation
                                  dataSet={value.standardDeviationList.filter(
                                    standarDeviation =>
                                      standarDeviation.standardDeviation !==
                                        0 && standarDeviation.median !== 0,
                                  )}
                                />
                              </DashboardChartBox>
                            </>
                          );
                        })}
                      </>
                    )
                  ) : (
                    <>
                      <DashboardChartBox>
                        <HeaderTitle>
                          <p>Percentage by Option</p>
                        </HeaderTitle>

                        <StackedBarPercentageResults
                          dataSet={stackedBarPercentageData}
                        />
                      </DashboardChartBox>

                      <DashboardChartBox>
                        <HeaderTitle>
                          <p>Standard Deviation </p>
                        </HeaderTitle>
                        <StandardDeviation
                          dataSet={standardDeviationList.filter(
                            standarDeviation =>
                              standarDeviation.standardDeviation !== 0 &&
                              standarDeviation.median !== 0,
                          )}
                        />
                      </DashboardChartBox>
                    </>
                  )
                ) : (
                  <DashboardChartBox>
                    <HeaderTitle>
                      <p>Percentage By Option</p>
                    </HeaderTitle>

                    <SelectMultipleBartChart
                      dataSet={selectOneOrMultipleBarData}
                    />
                  </DashboardChartBox>
                )}
              </DashBoardChartsContent>
            ) : (
              <ContainerEmpty>{`Please, select survey and question to show the charts.`}</ContainerEmpty>
            )}
          </>
        )}

        {selectedTab === 'kpis' && (
          <>
            {surveyId !== 0 ? (
              <StructureKpi idSurvey={surveyId}></StructureKpi>
            ) : (
              <ContainerEmpty>{`Please, select survey and question to show the charts.`}</ContainerEmpty>
            )}
          </>
        )}
      </DashboardContainer>
    </>
  );
};

export default ProjectAnalytics;
