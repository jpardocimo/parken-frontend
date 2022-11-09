import React, { useState, useEffect } from 'react';

import BubbleTree from './BubbleTree';
import api from '../../../services/api';

interface Structure {
  name: string;
  category: string;
  score: number;
  questionId?: number;
  topics?: Structure[];
}

interface ChartData {
  customerOrientationIndex: number;
  structure?: Structure[];
}

interface Props {
  surveyId: number;
  resultId?: number;
  pinkBackground?: boolean;
}

const BubbleTreeContainer: React.FC<Props> = props => {
  const [chartData, setChartData] = useState<ChartData>();
  const [topicValues, setTopicValues] = useState<any[]>([]);

  useEffect(() => {
    const url = props.resultId
      ? `/results/${props.resultId}/survey/${props.surveyId}/customerOrientationIndex`
      : `/results/survey/${props.surveyId}/customerOrientationIndex`;

    api.get(url).then(response => {
      const structureResults = response.data;
      const arrayTopicsFlat = structureResults.structure
        .flatMap(({ topics }: Structure) => topics)
        .map((topic: Structure, index: number) => {
          return {
            name: topic.name,
            value: Math.round(topic.score),
            rowOrder: index < 3 ? index + 1 : index - 2,
            columnSide: index < 3 ? 'left' : 'right',
          };
        });

      setTopicValues(arrayTopicsFlat);
      setChartData(response.data);
    });
  }, [props]);

  return (
    <>
      <BubbleTree
        aPillarTitles={
          chartData?.structure?.map((apillar: Structure, index: number) => {
            return {
              title: apillar.name,
              rowOrder: 1,
              columnSide: index === 0 ? 'left' : 'right',
            };
          }) ?? []
        }
        topicValueScores={topicValues}
        customerOrientationIndex={
          (chartData && Math.round(chartData.customerOrientationIndex)) ?? 0
        }
      />
    </>
  );
};

export default BubbleTreeContainer;
