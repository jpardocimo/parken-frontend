import React from 'react';
import { Radar } from 'react-chartjs-2';

interface Props {
  title: string;
  itens?: string[];
  values?: number[];
  benchmarkValues?: number[];
  displayTickLabel?: boolean;
  pinkBackground?: boolean;
}

const RadarChart: React.FC<Props> = ({
  title,
  itens,
  values,
  benchmarkValues,
  displayTickLabel = true,
  pinkBackground,
}) => {
  const options: any = {
    scale: {
      min: 0,
      max: 100,
      ticks: {
        display: false,
        maxTicksLimit: 3,
        suggestedMin: 0,
        suggestedMax: 10,
        showLabelBackdrop: false,
        fontColor: '#f2f2f2',
        fontSize: 16,
      },
      gridLines: { color: '#f2f2f2', lineWidth: 3 },
      angleLines: { color: '#f2f2f2', lineWidth: 0.2 },
      pointLabels: { display: false },
    },
    legend: {
      labels: { fontColor: '#f2f2f2', fontSize: 16 },
      display: false,
    },
  };

  const data = {
    labels: displayTickLabel ? itens : Array(itens?.length).fill(''),
    datasets: [
      {
        label: 'Benchmark',
        data: benchmarkValues || [],
        fill: true,
        backgroundColor: 'rgba(73, 155, 75, 0.2)',
        borderColor: 'rgb(73, 155, 75)',
        pointBackgroundColor: 'rgb(73, 155, 75)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(73, 155, 75)',
      },
      {
        label: title, // rgb(230, 131, 51)
        data: values || [],
        fill: true,
        backgroundColor: pinkBackground
          ? 'rgba(230, 96, 154, 0.2)'
          : 'rgba(230, 131, 51, 0.2)',
        borderColor: pinkBackground
          ? 'rgba(230, 96, 154)'
          : 'rgba(230, 131, 51)',
        pointBackgroundColor: pinkBackground
          ? 'rgba(230, 96, 154)'
          : 'rgba(230, 131, 51)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: pinkBackground
          ? 'rgba(230, 96, 154)'
          : 'rgba(230, 131, 51)',
      },
    ],
  };

  return (
    <>
      <Radar data={data} options={options} />
    </>
  );
};

export default RadarChart;
