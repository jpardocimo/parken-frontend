import React from 'react';
import { VictoryPie, VictoryLabel } from 'victory';
import { CircularProgressBarContainer, Titulo } from './styles';

interface Props {
  percent: number;
  title: string;
  color: string;
  width?: number;
}

const CircularProgressBar: React.FC<Props> = props => {
  return (
    <>
      <Titulo>{props.title}</Titulo>

      <CircularProgressBarContainer>
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          <VictoryPie
            standalone={false}
            animate={{ duration: 1000 }}
            width={props?.width ? props.width : 400}
            height={props?.width ? props.width : 400}
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
        </svg>
      </CircularProgressBarContainer>
    </>
  );
};

export default CircularProgressBar;
