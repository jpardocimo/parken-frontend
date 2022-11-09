import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { FiLink } from 'react-icons/fi';

import {
  Container,
  BoxFinalResultTextRightSide,
  BoxFinalResultValueRightSide,
  Wrap,
  LeftContainer,
  TextContainer,
  Header,
  HeaderLine,
  Body,
  BoxFooter,
  BottomContainer,
  Span,
} from './styles';
import ChartAndTopicsComponent from './ChartAndTopicsComponent';

interface TopicValueScore {
  name: string;
  value: number;
  benchmark: number;
  rowOrder: number;
  columnSide: string;
}

interface ApillarTitle {
  title: string;
  rowOrder: number;
  columnSide: string;
}

interface Props {
  aPillarTitles: ApillarTitle[];
  topicValueScores: TopicValueScore[];
  customerOrientationIndex: number;
}

const BubbleTree: React.FC<Props> = ({
  aPillarTitles,
  topicValueScores,
  customerOrientationIndex,
}) => {
  const [textReport, setTextReport] = useState('');
  useEffect(() => {
    if (customerOrientationIndex >= 90 && customerOrientationIndex <= 100) {
      setTextReport(
        'WOW, gratuliere, Sie sind auf einem ausgezeichneten Weg und haben sich ein Gütesiegel verdient. Schön, dass es Organisationen gibt, die verstanden haben, dass Ihre Kund:innen und Unternehmen eine Einheit bilden. Bleiben Sie so kundenzentriert und entwickeln Sie sich voran.',
      );
    }

    if (customerOrientationIndex >= 80 && customerOrientationIndex <= 89) {
      setTextReport(
        'Herzlichen Glückwunsch, Sie würden mit dem Ergebnis noch das TSÖ Gütesiegel von uns erhalten. Ihre Organisation hat Potenzial für Großes. Sie denken das Thema Kundenorientierung schon ganzheitlich, sieht das Management und Ihre Kund:innen das genauso? Finden Sie es heraus mit TSÖ.',
      );
    }

    if (customerOrientationIndex >= 70 && customerOrientationIndex <= 79) {
      setTextReport(
        'Jetzt aber ran ans Thema! Sie wissen, dass es in vielen Bereichen Potentiale gibt. Warten Sie nicht, bis es eng wird, sondern handeln Sie heute. Packen Sie das Thema Kundenorientierung intern und extern an. Starten Sie dafür mit einer Bestandsaufnahme, wo Kund:innen und Management Verbesserungspotential sehen.',
      );
    }

    if (customerOrientationIndex <= 69) {
      setTextReport(
        'Was soll man sagen? Toll, dass Ihnen noch Kund:innen treu sind, aber besser Sie ändern Entscheidendes. Das kommt jetzt natürlich auch nicht überraschend, aber fragen Sie mal mit unserer anonymen Erhebung Ihre Kund:innen und Ihr Management und packen Sie genau dort an. Wir helfen gern dabei!',
      );
    }
  }, [customerOrientationIndex]);

  return (
    <Wrap>
      <Container>
        <ChartAndTopicsComponent
          aPillarTitles={aPillarTitles}
          topicValueScores={topicValueScores}
          customerOrientationIndex={customerOrientationIndex}
        ></ChartAndTopicsComponent>

        <LeftContainer>
          <TextContainer>
            <Header>
              <BoxFinalResultTextRightSide>
                <span>CUSTOMER ORIENTATION INDEX</span>
              </BoxFinalResultTextRightSide>
              <BoxFinalResultValueRightSide>
                <span>
                  {customerOrientationIndex === -99
                    ? 'k/a'
                    : customerOrientationIndex}
                </span>
              </BoxFinalResultValueRightSide>
              <HeaderLine></HeaderLine>
            </Header>
            <Body>
              <p>{textReport}</p>
            </Body>
          </TextContainer>
        </LeftContainer>
      </Container>

      <BottomContainer>
        <p>
          Die ausgewiesenen Indexwerte können zwischen 0 (= Minimum) und 100 (=
          Maximum) liegen. Somit gilt, je höher der Indexwert, desto besser die
          Leistung.
        </p>

        <Link to={`/aftersurvey`} target="_blank">
          <BoxFooter>
            <FiLink size={22} color={'#ff0000'} />
            <Span>
              <h4>Neugierig geworden?</h4>
              <br />
              Erfahren Sie mehr über die weiteren Schritte
            </Span>
          </BoxFooter>
        </Link>
      </BottomContainer>
    </Wrap>
  );
};

export default BubbleTree;
