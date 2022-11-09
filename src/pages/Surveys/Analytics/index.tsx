import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import RadarContainer from '../../../components/Charts/Radar/RadarContainer';

import { Container } from './styles';

interface ParamTypes {
  surveyId: string;
}

const surveysSpiritHoch3 = [55, 53, 56];
const Analytics: React.FC = () => {
  const { surveyId } = useParams<ParamTypes>();
  const [isSpiritHoch3, setIsSpiritHoch3] = useState(false);
  useEffect(() => {
    const isSpiritHochDrei = surveysSpiritHoch3.some(
      id => id.toString() === surveyId,
    ); // {JSON.stringify(isSpiritHoch3)}
    setIsSpiritHoch3(isSpiritHochDrei);
  }, [isSpiritHoch3, surveyId]);

  return (
    <Container>
      <h1>Analytics</h1>
      <RadarContainer
        pinkBackground={isSpiritHoch3}
        surveyId={+surveyId}
      ></RadarContainer>
    </Container>
  );
};

export default Analytics;
