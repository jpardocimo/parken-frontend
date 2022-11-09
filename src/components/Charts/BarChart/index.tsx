import React, { useEffect, useState } from 'react';

import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
} from 'victory';
import getDividedString from '../../../utils/getDividedString';

interface Percentage {
  percentage: number;
  result: number;
  optionName: string;
}

interface PercentageData {
  questionTitle: string;
  questionId: number;
  percentageData: Percentage[];
}

interface Props {
  dataSet: PercentageData[];
}

const BarChart: React.FC<Props> = ({ dataSet }) => {
  const [dataChart, setDataChart] = useState<PercentageData[]>([]);
  const [chartHeight, setChartHeight] = useState(0);
  const [barRatio, setBarRatio] = useState(0);

  useEffect(() => {
    const resultsChart: any = [];

    const percentageDataFromDatabase = dataSet[0]?.percentageData;
    percentageDataFromDatabase?.forEach((item: Percentage) => {
      const arrayOptions = [];
      arrayOptions.push(
        ...[
          {
            result: item.result,
            x: item.optionName,
            y: item.percentage,
          },
        ],
      );
      resultsChart.push(...[arrayOptions]);
    });

    const results = resultsChart.map((item: any) => item[0]);
    setDataChart(results);
    const arrayLength = results.length <= 2 ? 450 : 850;
    const barWidth = results.length <= 2 ? 1.2 : 0.8;
    setBarRatio(barWidth);
    setChartHeight(arrayLength);
  }, [dataSet]);

  return (
    <>
      <VictoryChart
        padding={{ bottom: 130, right: 150, left: 420, top: 90 }}
        domainPadding={{ x: 60 }}
        theme={VictoryTheme.material}
        width={1500}
        height={chartHeight}
        animate={false}
        horizontal
      >
        <VictoryBar
          data={dataChart}
          barRatio={barRatio}
          labels={({ datum }) => {
            if (datum.y === 0) return '';
            return `${Math.round(datum.y)} %`;
          }}
          style={{
            data: { fill: '#418C82' }, // 020909eb
            labels: {
              fill: '#F1ECD7',
              textAnchor: 'middle',
              fontSize: '22px',
            },
          }}
          labelComponent={
            <VictoryLabel
              dx={(d: any) => {
                if (!d) return '';
                return ((-(780 - 2 * 30) / (100 - 0)) * d?.datum.y) / 2;
              }}
            />
          }
        />
        {dataChart.map((item: any, i: number) => {
          return (
            <VictoryAxis
              key={i}
              dependentAxis
              tickFormat={tick => `${tick}%`}
              domain={[0, 5]}
              style={{
                grid: { stroke: 'transparent' },
                tickLabels: { fontSize: '20px' },
              }}
            />
          );
        })}

        {dataChart.map((item: any, i: number) => {
          return (
            <VictoryAxis
              key={i}
              tickFormat={tick => `${getDividedString(tick, 60)}`}
              tickLabelComponent={
                <VictoryLabel
                  datum={(datum: any) => datum.y}
                  style={{
                    fontSize: '24px',
                    wordBreak: 'break-all',
                  }}
                />
              }
              style={{
                tickLabels: { fontSize: '21px' },
                grid: { stroke: 'transparent' },
              }}
            />
          );
        })}
      </VictoryChart>
    </>
  );
};
export default BarChart;
