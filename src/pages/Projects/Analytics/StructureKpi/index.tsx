import React, { useEffect, useState } from 'react';
import getDividedString from '../../../../utils/getDividedString';
import CircularDoubleProgressBar from '../../../../components/Charts/CircularDoubleProgressBar';
import BarChartsKpis from '../../../../components/Charts/BarChartsKpis';
import api from '../../../../services/api';
import {
  ContainerKpiList,
  ContainerMenuKpis,
  ContainerSelectedKpis,
  KpiListCard,
  Container,
  ContainerTreeKpi,
  ContainerMainKpi,
  ContainerCentered,
} from './styles';

import SideMenu from '../SideMenuKpis';

interface kpi {
  name: string;
  score: number;
  category: string;
  topics: kpi[];
  scoreBenchmark?: number;
}

interface Props {
  idSurvey: number;
}

const StructureKpi: React.FC<Props> = props => {
  const [kpiList, setKpiList] = useState<kpi[]>([]);
  const [selectedMainKpi, setSelectedMainKpi] = useState<kpi>();
  const [selectedFKpi, setSelectedFKpi] = useState<kpi>();
  const [selectedGfKpi, setSelectedGfKpi] = useState<kpi>();

  const [open, setOpen] = useState<boolean>(false);

  function initializingVariables(): void {
    const kpiAux: kpi[] = [];
    setKpiList(kpiAux);
    setSelectedGfKpi(undefined);
    setSelectedFKpi(undefined);
    setSelectedMainKpi(undefined);
  }

  function createMockWithBenchMark(): kpi {
    const kpiQuestion1: kpi = {
      name: `Die Arbeit gibt mir Möglichkeiten, mich über meine Leistung oder meinen Erfolg zu freuen.`,
      score: 60,
      category: `Question`,
      topics: [],
      scoreBenchmark: 80,
    };
    const kpiQuestion2: kpi = {
      name: `Ich bin von meinen Arbeitsaufgaben ...`,
      score: 68,
      category: `Question`,
      topics: [],
      scoreBenchmark: 80,
    };

    const kpiQuestion3: kpi = {
      name: `der Zusammenarbeit mit Ihrer direkten Führungskraft?`,
      score: 68,
      category: `Question`,
      topics: [],
      scoreBenchmark: 80,
    };

    const kpiSubtopic1: kpi = {
      name: `Subtopic 1 Mock Benchmark`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2, kpiQuestion3],
      scoreBenchmark: 80,
    };

    const kpiSubtopic2: kpi = {
      name: `Subtopic 2 Mock Benchmark`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2],
      scoreBenchmark: 80,
    };

    const kpiSubtopic3: kpi = {
      name: `Subtopic 3 Mock Benchmark`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2],
      scoreBenchmark: 80,
    };

    const kpiTopic1: kpi = {
      name: `Topic 2 Mock Benchmark`,
      score: 90,
      category: `Topic`,
      topics: [kpiSubtopic1, kpiSubtopic2],
      scoreBenchmark: 80,
    };

    const kpiTopic: kpi = {
      name: `Topic 1 Mock Benchmark`,
      score: 90,
      category: `Topic`,
      topics: [kpiSubtopic3],
      scoreBenchmark: 90,
    };

    const kpiApillar: kpi = {
      name: `A-pillar Mock Benchmark`,
      score: 75,
      category: `A-Pillar`,
      topics: [kpiTopic, kpiTopic1],
      scoreBenchmark: 90,
    };

    return kpiApillar;
  }

  function createMock(): kpi {
    const kpiQuestion1: kpi = {
      name: `Question 1 Mock`,
      score: 60,
      category: `Question`,
      topics: [],
    };
    const kpiQuestion2: kpi = {
      name: `Question 2 Mock`,
      score: 68,
      category: `Question`,
      topics: [],
    };
    const kpiQuestion3: kpi = {
      name: `Question 3 Mock`,
      score: 70,
      category: `Question`,
      topics: [],
    };

    const kpiSubtopic1: kpi = {
      name: `Subtopic 1 Mock`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2, kpiQuestion3],
    };

    const kpiSubtopic2: kpi = {
      name: `Subtopic 2 Mock`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2, kpiQuestion3],
    };

    const kpiSubtopic3: kpi = {
      name: `Subtopic 3 Mock`,
      score: 80,
      category: `Subtopic`,
      topics: [kpiQuestion1, kpiQuestion2, kpiQuestion3],
    };

    const kpiTopic1: kpi = {
      name: `Topic 2 Mock`,
      score: 90,
      category: `Topic`,
      topics: [kpiSubtopic1, kpiSubtopic2],
    };

    const kpiTopic: kpi = {
      name: `Topic 1 Mock`,
      score: 90,
      category: `Topic`,
      topics: [kpiSubtopic3],
    };

    const kpiApillar: kpi = {
      name: `A-pillar Mock`,
      score: 75,
      category: `A-Pillar`,
      topics: [kpiTopic, kpiTopic1],
    };

    return kpiApillar;
  }

  function handleOnClickKpi(kpiClicked: kpi): void {
    if (kpiClicked?.topics?.length > 0) {
      if (selectedMainKpi !== undefined) {
        if (selectedFKpi !== undefined) {
          setSelectedGfKpi(selectedFKpi);
        }
        setSelectedFKpi(selectedMainKpi);
      }
      setSelectedMainKpi(kpiClicked);
    }
  }

  function handleMenuKpiApillar(kpiSelected: kpi): void {
    setSelectedGfKpi(undefined);
    setSelectedFKpi(undefined);
    setSelectedMainKpi(kpiSelected);
    setOpen(!open);
  }

  function handleMenuKpiTopic(kpiSelected: kpi, apillar: kpi): void {
    setSelectedGfKpi(undefined);
    setSelectedFKpi(apillar);
    setSelectedMainKpi(kpiSelected);
  }

  function handleMenuKpiSubtopic(
    kpiSelected: kpi,
    topic: kpi,
    apillar: kpi,
  ): void {
    setSelectedGfKpi(apillar);
    setSelectedFKpi(topic);
    setSelectedMainKpi(kpiSelected);
  }

  function getColorCircularProgress(category: string): string {
    if (category === 'A-Pillar') return '#FF780C';
    if (category === 'Topic') return '#47283A';
    if (category === 'Question') return 'transparent';
    return '#615B52';
  }

  useEffect(() => {
    api
      .get(`/results/survey/${props.idSurvey}/scoreResults`)
      .then(response => {
        initializingVariables();
        // response.data.push(createMock());
        response.data.push(createMockWithBenchMark());
        setKpiList(response.data);
      })
      .catch(error => {
        initializingVariables();
      });
  }, [props]);

  return (
    <Container>
      <>
        {selectedMainKpi ? (
          <ContainerMainKpi>
            <ContainerTreeKpi>
              {selectedGfKpi !== undefined && (
                <ContainerCentered>
                  <ContainerSelectedKpis cardType={'grandfather'}>
                    <div key={selectedGfKpi.name}>
                      <CircularDoubleProgressBar
                        title={selectedGfKpi.name}
                        percent={selectedGfKpi.score}
                        color={getColorCircularProgress(selectedGfKpi.category)}
                        width={'0 0 500 500'}
                        percentBenchmark={selectedGfKpi.scoreBenchmark}
                      />
                    </div>
                  </ContainerSelectedKpis>
                </ContainerCentered>
              )}
              {selectedFKpi !== undefined && (
                <ContainerCentered>
                  <ContainerSelectedKpis cardType={'father'}>
                    <div key={selectedFKpi.name}>
                      <CircularDoubleProgressBar
                        title={selectedFKpi.name}
                        percent={selectedFKpi.score}
                        color={getColorCircularProgress(selectedFKpi.category)}
                        width={'0 0 450 450'}
                        percentBenchmark={selectedFKpi.scoreBenchmark}
                      />
                    </div>
                  </ContainerSelectedKpis>
                </ContainerCentered>
              )}
              <ContainerCentered>
                <ContainerSelectedKpis cardType={'main'}>
                  <CircularDoubleProgressBar
                    title={selectedMainKpi.name}
                    percent={selectedMainKpi.score}
                    color={getColorCircularProgress(selectedMainKpi.category)}
                    width={'0 0 400 400'}
                    percentBenchmark={selectedMainKpi.scoreBenchmark}
                  />
                </ContainerSelectedKpis>
              </ContainerCentered>
              {selectedMainKpi?.topics.some(
                (result: kpi) => result.category === 'Question',
              ) ? (
                <ContainerCentered>
                  <ContainerSelectedKpis cardType="question">
                    <BarChartsKpis
                      data={selectedMainKpi?.topics.map((data: kpi) => {
                        return {
                          x: getDividedString(data.name, 40).reduce(
                            (previousValue, currentValue) =>
                              `${previousValue}\n${currentValue}`,
                            '',
                          ),
                          y: data.score ?? 0,
                        };
                      })}
                      dataBenchmark={selectedMainKpi?.topics.map(
                        (data: kpi) => {
                          return {
                            x: getDividedString(data.name, 40).reduce(
                              (previousValue, currentValue) =>
                                `${previousValue}\n${currentValue}`,
                              '',
                            ),
                            y: data.scoreBenchmark ?? 0,
                          };
                        },
                      )}
                      hasBenchmark={!!selectedMainKpi.scoreBenchmark}
                    ></BarChartsKpis>
                  </ContainerSelectedKpis>
                </ContainerCentered>
              ) : (
                <ContainerKpiList>
                  {selectedMainKpi?.topics.map((result: kpi) => (
                    <KpiListCard key={result.name}>
                      <div onClick={() => handleOnClickKpi(result)}>
                        <CircularDoubleProgressBar
                          title={result.name}
                          percent={result.score}
                          color={getColorCircularProgress(result.category)}
                          width={'0 0 400 400'}
                          percentBenchmark={result.scoreBenchmark}
                        />
                      </div>
                    </KpiListCard>
                  ))}
                </ContainerKpiList>
              )}
            </ContainerTreeKpi>
            <ContainerMenuKpis>
              {kpiList !== undefined &&
                kpiList.map((apillar: kpi) => {
                  return (
                    <SideMenu
                      kpi={apillar}
                      key={apillar.name}
                      handleApillar={handleMenuKpiApillar}
                      handleTopic={handleMenuKpiTopic}
                      handleSubtopic={handleMenuKpiSubtopic}
                    ></SideMenu>
                  );
                })}
            </ContainerMenuKpis>
          </ContainerMainKpi>
        ) : (
          <ContainerKpiList>
            {kpiList.map((result: kpi) => (
              <KpiListCard key={result.name}>
                <div onClick={() => handleOnClickKpi(result)}>
                  <CircularDoubleProgressBar
                    title={result.name}
                    percent={result.score}
                    color={getColorCircularProgress(result.category)}
                    percentBenchmark={result.scoreBenchmark}
                    width={'0 0 400 400'}
                  />
                </div>
              </KpiListCard>
            ))}
          </ContainerKpiList>
        )}
      </>
    </Container>
  );
};
export default StructureKpi;
