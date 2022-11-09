import React, { useEffect, useState } from 'react';

import {
  VictoryTheme,
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryErrorBar,
  VictoryLegend,
} from 'victory';
import getDividedString from '../../../utils/getDividedString';

interface StandardDeviationData {
  questionTitle: string;
  questionId: number;
  standardDeviation: number;
  median: number;
  average: number;
}

interface Props {
  dataSet: StandardDeviationData[];
}

const StandardDeviation: React.FC<Props> = ({ dataSet }) => {
  const [dataChart, setDataChart] = useState<StandardDeviationData[]>([]);
  useEffect(() => {
    const localDataSet: StandardDeviationData[] = [];
    localDataSet.push(...dataSet);

    localDataSet.sort((a, b) => (a.questionId > b.questionId ? -1 : 1));
    setDataChart(localDataSet);
  }, [dataSet]);

  return (
    <VictoryChart
      padding={{ bottom: 210, right: 200, left: 750, top: 150 }}
      theme={VictoryTheme.material}
      width={1500}
      // height={dataChart?.length === 1 ? 440 : 640}
      height={dataChart?.length <= 10 ? 550 : 2600}
      animate={false}
    >
      <VictoryErrorBar
        borderWidth={10}
        standalone={false}
        animate={false}
        width={300}
        height={300}
        padding={20}
        style={{
          data: {
            strokeWidth: 2,
          },
        }}
        data={dataChart.map((dc, index) => {
          return {
            x: dc.average,
            y: index + 1,
            error: dc.standardDeviation,
          };
        })}
        errorX={datum => datum.error}
      />
      <VictoryAxis
        domain={[0, 5]}
        style={{
          grid: { stroke: 'transparent' },
          tickLabels: { fontSize: '20px' },
        }}
      />
      {dataChart.map((item: any, i: number) => {
        return (
          <VictoryAxis
            key={i}
            tickValues={[
              ...dataChart.map((d: any) => {
                return d.questionTitle;
              }),
            ]}
            tickFormat={[
              ...dataChart.map((d: any) => {
                const questioTitle = getDividedString(d.questionTitle, 80);
                return questioTitle;
              }),
            ]}
            tickLabelComponent={
              <VictoryLabel
                datum={(datum: any) => datum.y}
                style={{
                  fontSize: '19px',
                }}
              />
            }
            style={{
              grid: { stroke: 'transparent' },
              tickLabels: { fontSize: '18px' },
            }}
            domain={[dataChart.length + 1, 0]}
            dependentAxis={true}
          />
        );
      })}
      <VictoryScatter
        labels={({ datum }) => datum?.x?.toFixed(1)}
        labelComponent={<VictoryLabel dx={({ datum }) => datum?.x + 5} />}
        style={{
          data: { fill: '#c43a31' },
          labels: {
            fontSize: 13,
            fill: '#c43a31',
          },
        }}
        size={6}
        data={dataChart.map((dc, index) => {
          return {
            x: dc.median,
            y: index + 1,
          };
        })}
      />
      <VictoryScatter
        labels={({ datum }) => datum?.x?.toFixed(1)}
        labelComponent={<VictoryLabel />}
        style={{
          data: { fill: '#0000FF' },
          labels: {
            fontSize: 13,
            fill: '#0000FF',
            padding: 20,
          },
        }}
        size={6}
        data={dataChart.map((dc, index) => {
          return {
            x: dc.average,
            y: index + 1,
          };
        })}
      />
      <VictoryLegend
        x={650}
        // y={dataChart?.length === 1 ? 350 : 550}
        y={dataSet?.length <= 10 ? 440 : 2500}
        orientation="horizontal"
        itemsPerRow={2}
        gutter={85}
        rowGutter={{ top: 8, bottom: 8 }}
        colorScale={['#0000FF', '#c43a31']}
        data={[{ name: 'Average' }, { name: 'Median' }]}
        labelComponent={
          <VictoryLabel
            style={{
              fontSize: '24px',
            }}
          />
        }
      />
    </VictoryChart>
  );
};

export default StandardDeviation;
