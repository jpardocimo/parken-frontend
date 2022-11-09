import React from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryStack,
  VictoryGroup,
  VictoryLegend,
} from 'victory';
import { BarChartKpisContainer } from './styles';

interface Props {
  dataBenchmark: any[];
  data: any[];
  hasBenchmark: boolean;
}

const BarChartsKpis: React.FC<Props> = props => {
  return (
    <BarChartKpisContainer>
      <VictoryChart
        horizontal
        domainPadding={{ x: 50 }}
        padding={{ bottom: 50, right: 50, left: 280, top: 50 }}
        width={700}
        height={300}
      >
        <VictoryGroup offset={15}>
          {props.hasBenchmark && (
            <VictoryStack
              style={{ data: { width: 15 } }}
              labelComponent={
                <VictoryLabel
                  dx={-5}
                  textAnchor="end"
                  style={{ fill: 'white' }}
                />
              }
            >
              <VictoryBar
                // benchmark
                colorScale={['#CCCCCC']}
                labels={({ datum }) => {
                  if (datum.y === 0) return '';
                  return `${Math.round(datum.y)}`;
                }}
                data={props.dataBenchmark}
              />
            </VictoryStack>
          )}
          <VictoryStack
            style={{ data: { width: 15 } }}
            colorScale="warm"
            labelComponent={
              <VictoryLabel
                dx={-5}
                textAnchor="end"
                style={{ fill: 'white' }}
              />
            }
          >
            <VictoryBar
              colorScale={['#FF780C']}
              labels={({ datum }) => {
                if (datum.y === 0) return '';
                return `${Math.round(datum.y)}`;
              }}
              data={props.data}
            />
          </VictoryStack>
        </VictoryGroup>
        {props.hasBenchmark && (
          <VictoryLegend
            x={280}
            y={10}
            orientation="horizontal"
            gutter={20}
            style={{ border: { stroke: 'transparent' } }}
            colorScale={['#FF780C', '#CCCCCC']}
            data={[{ name: 'KPI' }, { name: 'Benchmark' }]}
          />
        )}
      </VictoryChart>
    </BarChartKpisContainer>
  );
};

export default BarChartsKpis;
