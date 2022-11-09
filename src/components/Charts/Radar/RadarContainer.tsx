import React, { useState, useEffect, useCallback } from 'react';

import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import RadarChart from './Radar';
import getScoreText from '../../../utils/getScoreText';
import chartCultureReadinessScoreOrange from '../../../assets/bg-radar-chart.png';
import chartRiskCultureReadinessScoreOrange from '../../../assets/bg-radar-chart2.png';
import chartBackgroundSpiritHochDreiPink from '../../../assets/bg-radar-chart-pink.png';

import {
  Wrap,
  Container,
  ChartContainer,
  LeftContainer,
  TextContainer,
  Header,
  HeaderLine,
  Score,
  Body,
  BodyLine,
  RefreshButton,
  ButtonLeft,
  ButtonRight,
  BottomContainer,
  BoxFooter,
} from './styles';

import api from '../../../services/api';

interface Topic {
  name: string;
  category: string;
  score: number;
  questionId?: number;
  topics?: Topic[];
}

interface Props {
  surveyId: number;
  resultId?: number;
  pinkBackground?: boolean;
  // urlRadarChart?: string;
}

const benchmarkCRS = [69, 75, 73, 73, 70];
const benchmarkRCRS = [74, 81, 66, 70, 50];

const RadarContainer: React.FC<Props> = props => {
  const [structure, setStructure] = useState<Topic[]>([]);
  const [currentAPillar, setCurrentAPillar] = useState<Topic>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceUpdateValue, setForceUpdateValue] = useState(0);
  const [imageBackGround, setImageBackGround] = useState('');

  useEffect(() => {
    if (props.pinkBackground) {
      setImageBackGround(`${chartBackgroundSpiritHochDreiPink}`);
    } else if (currentAPillar?.name === 'Culture Readiness Score') {
      setImageBackGround(`${chartCultureReadinessScoreOrange}`);
    } else {
      setImageBackGround(`${chartRiskCultureReadinessScoreOrange}`);
    }

    const url = props.resultId
      ? `/results/${props.resultId}/survey/${props.surveyId}/scoreResults`
      : `/results/survey/${props.surveyId}/scoreResults`;

    api.get(url).then(response => {
      setStructure(response.data);
      setCurrentAPillar(response.data[currentIndex]);
    });
  }, [forceUpdateValue, currentIndex, props, currentAPillar?.name]);

  const handleRefresh = useCallback(() => {
    setForceUpdateValue(forceUpdateValue + 1);
  }, [forceUpdateValue]);

  const handlePrev = useCallback(() => {
    setCurrentAPillar(structure[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  }, [structure, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentAPillar(structure[currentIndex + 1]);
    setCurrentIndex(currentIndex + 1);
  }, [structure, currentIndex]);

  return (
    <Wrap>
      {!props.resultId && (
        <>
          <RefreshButton type="button" onClick={handleRefresh}>
            <FiRefreshCw size={30} />
          </RefreshButton>
        </>
      )}

      <Container>
        <ChartContainer
          APillarName={
            props.pinkBackground ||
            currentAPillar?.name === 'Culture Readiness Score'
              ? 'apillar1'
              : 'apillar2'
          }
          imageBackGround={imageBackGround}
        >
          <RadarChart
            title={
              props.resultId
                ? 'Ihr Wert'
                : currentAPillar
                ? currentAPillar.name
                : 'k/a'
            }
            itens={
              currentAPillar?.topics &&
              currentAPillar.topics.flatMap((topic: Topic) => {
                return topic.name.split(' - ')[0];
              })
            }
            values={
              currentAPillar?.topics &&
              currentAPillar.topics.flatMap((topic: Topic) => {
                return Math.round(topic.score);
              })
            }
            benchmarkValues={
              currentAPillar?.name === 'Culture Readiness Score'
                ? benchmarkCRS
                : benchmarkRCRS
            }
            displayTickLabel={false}
            pinkBackground={props.pinkBackground}
          />
        </ChartContainer>

        <LeftContainer>
          {currentIndex > 0 && (
            <ButtonLeft type="button" onClick={handlePrev}>
              <FiChevronLeft size={60} />
            </ButtonLeft>
          )}

          <TextContainer>
            <Header>
              <HeaderLine>
                <h1>{currentAPillar?.name}</h1>
                <Score>
                  {currentAPillar
                    ? Math.round(currentAPillar.score / 10)
                    : 'k/a'}
                </Score>
              </HeaderLine>

              <p>
                {currentAPillar?.name === 'Risk Culture Readiness Score'
                  ? 'Es muss eine KULTUR geschaffen werden, in der Mitarbeiter sich der Risiken des TUNS und UNTERLASSENS bewusst sind. Darüber hinaus ist es wichtig, dass sich die Risikokultur für alle Mitarbeiter „richtig“ anfühlt und sie das Thema mit einem positiven Zugang BEWERTEN.'
                  : currentAPillar?.score
                  ? getScoreText(Math.round(currentAPillar.score / 10))
                  : 'Es konnten noch keine Scores berechnet werden, da noch keine Daten vorliegen.'}
              </p>
            </Header>

            <Body>
              {currentAPillar?.topics?.map((topic, i) => (
                <BodyLine
                  key={i}
                  APillarName={
                    currentAPillar?.name === 'Culture Readiness Score'
                      ? 'apillar1'
                      : 'apillar2'
                  }
                >
                  <h4>{topic.name}</h4>
                  <h3>{topic.score ? `${Math.round(topic.score)}` : 'k/a'}</h3>
                </BodyLine>
              ))}
            </Body>
          </TextContainer>

          {currentIndex !== structure.length - 1 && (
            <ButtonRight type="button" onClick={handleNext}>
              <FiChevronRight size={60} />
            </ButtonRight>
          )}
        </LeftContainer>
      </Container>

      <BottomContainer>
        <p>
          Die ausgewiesenen Indexwerte können zwischen 0 (= Minimum) und 100 (=
          Maximum) liegen. Somit gilt, je höher der Indexwert, desto besser die
          Leistung.
        </p>

        {props.resultId && (
          <BoxFooter>
            <h1>Ideen für Ihre nächsten Schritte:</h1>
            <ul>
              <li>
                In den kommenden Tagen erhalten Sie die vertiefende Analyse per
                E-Mail zugeschickt. Rufen Sie uns doch an und besprechen Sie
                Ihre Ergebnisse mit einem unserer Expert:innen.
                {props.pinkBackground ? (
                  <a
                    href="https://spirit-hoch3.com/kontakt/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Termin anfragen.
                  </a>
                ) : (
                  <a
                    href="https://outlook.office365.com/owa/calendar/emotionbankingGmbH@emotion-banking.at/bookings/s/hMarf71VQkCg9JylnJWVAA2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Termin buchen.
                  </a>
                )}
              </li>
              <li>
                Neugierig geworden, wie Kultur in Ihrem Haus von allen
                Kolleg:innen wahrgenommen wird? Gerne machen wir Ihnen ein
                Angebot zu einem detailliertem Kulturaudit.
              </li>
            </ul>
          </BoxFooter>
        )}
      </BottomContainer>
    </Wrap>
  );
};

export default RadarContainer;
