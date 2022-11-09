import React from 'react';

import {
  VictoryChart,
  VictoryStack,
  VictoryAxis,
  VictoryBar,
  VictoryLabel,
  VictoryLegend,
  VictoryTheme,
} from 'victory';
import getDividedString from '../../../utils/getDividedString';

interface Props {
  dataSet: any[];
}

const round = (num: number): number => {
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
};

const colorArrayPositiveToNegative = [
  '#418C82',
  '#A6C3A3',
  '#F1ECD7',
  '#E8A873',
  '#C55E2D',
];

const StackedBarPercentageResults: React.FC<Props> = ({ dataSet }) => {
  return (
    <div>
      <VictoryChart
        padding={{ bottom: 170, right: 150, left: 560, top: 50 }}
        domainPadding={{ x: 60 }}
        theme={VictoryTheme.material}
        width={1500}
        height={dataSet[0]?.length <= 10 ? 440 : 2600}
        animate={false}
        horizontal
      >
        <VictoryStack colorScale={colorArrayPositiveToNegative}>
          {dataSet
            .sort((a, b) => (a.questionId > b.questionId ? -1 : 1))
            .map((data: any, i: number) => {
              return (
                <VictoryBar
                  data={
                    data &&
                    data.sort((a: any, b: any) =>
                      a.questionId > b.questionId ? -1 : 1,
                    )
                  }
                  key={i}
                  barRatio={dataSet[0].length < 2 ? 7 : 0.8}
                  labels={({ datum }) => {
                    if (datum.y === 0) return '';
                    return `${Math.round(datum.y)} %`;
                  }}
                  style={{
                    labels: {
                      fill: '020909eb',
                      textAnchor: 'middle',
                      fontSize: '18px',
                      color: '#041817d4',
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
              );
            })}
        </VictoryStack>
        <VictoryAxis
          dependentAxis
          tickFormat={tick => `${tick}%`}
          domain={[0, 5]}
          style={{
            grid: { stroke: 'transparent' },
            tickLabels: { fontSize: '20px' },
          }}
        />
        {dataSet.map((item: any, i: number) => {
          return (
            <VictoryAxis
              key={i}
              tickFormat={item?.map((axis: any) => {
                const wrappedText = getDividedString(axis.x, 60);
                return wrappedText;
              })}
              tickLabelComponent={
                <VictoryLabel
                  datum={(datum: any) => datum.y}
                  style={{
                    fontSize: '19px',
                    wordBreak: 'break-all',
                  }}
                />
              }
              style={{
                grid: { stroke: 'transparent' },
                tickLabels: { fontSize: '18px' },
              }}
            />
          );
        })}
        <VictoryLegend
          x={550}
          y={dataSet[0]?.length <= 10 ? 350 : 2500}
          orientation="horizontal"
          itemsPerRow={3}
          gutter={155}
          rowGutter={{ top: 8, bottom: 8 }}
          colorScale={colorArrayPositiveToNegative}
          data={dataSet?.map((d: any) => {
            return { name: d && d[0]?.name };
          })}
          labelComponent={
            <VictoryLabel
              style={{
                fontSize: '24px',
              }}
            />
          }
        />
      </VictoryChart>
    </div>
  );
};

export default StackedBarPercentageResults;
