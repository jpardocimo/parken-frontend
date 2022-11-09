import React from 'react';
import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import { CircularDoubleProgressBarContainer, Titulo } from './styles';

interface Props {
  percent: number;
  title: string;
  color: string;
  width: string;
  percentBenchmark?: number;
}

const CircularDoubleProgressBar: React.FC<Props> = props => {
  return (
    <div>
      <Titulo>{props.title}</Titulo>

      <CircularDoubleProgressBarContainer>
        <svg viewBox={props.width} width="100%">
          {!!props.percentBenchmark && (
            <VictoryPie
              // Benchmark
              standalone={false}
              data={[
                { x: 1, y: props.percentBenchmark },
                { x: 2, y: props.percentBenchmark },
              ]}
              innerRadius={180}
              cornerRadius={25}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => {
                    return datum.x === 1 ? '#CCCCCC' : 'transparent';
                  },
                },
              }}
            />
          )}
          <VictoryPie
            standalone={false}
            data={[
              { x: 1, y: props.percent },
              { x: 2, y: 100 - props.percent },
            ]}
            innerRadius={120}
            cornerRadius={25}
            labels={() => null}
            style={{
              data: {
                fill: ({ datum }) => {
                  // const color = datum.y > 30 ? 'green' : 'red';
                  return datum.x === 1 ? props.color : 'transparent';
                },
              },
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={200}
            y={200}
            text={`${Math.round(props.percent)}`}
            style={{ fontSize: 80 }}
          />
          {!!props.percentBenchmark && (
            <VictoryLabel
              // score do benchmark
              textAnchor="middle"
              verticalAnchor="middle"
              x={350}
              y={20}
              text={props.percentBenchmark}
              style={{ fontSize: 50 }}
            />
          )}
        </svg>
      </CircularDoubleProgressBarContainer>
      {!!props.percentBenchmark && (
        <VictoryLegend
          x={150}
          // y={0}
          orientation="horizontal"
          gutter={20}
          style={{ border: { stroke: 'transparent' } }}
          colorScale={[props.color, '#CCCCCC']}
          data={[{ name: 'KPI' }, { name: 'Benchmark' }]}
          width={500}
          height={50}
        />
      )}
    </div>
  );
};

export default CircularDoubleProgressBar;
