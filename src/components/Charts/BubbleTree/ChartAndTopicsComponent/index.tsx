import React from 'react';
import {
  ChartContainer,
  ValuesContainer,
  ValueOrangeLeft,
  ValuePurple,
  ValueBlue,
  ValueOrangeRight,
  ValuesHorizontalContainer,
  ValueGreen,
  ValueGrayLeft1,
  ValueGrayLeft3,
  ValueGrayLeft2,
  ValueGrayRight1,
  ValueGrayRight2,
  BoxFinalResultText,
  BoxFinalResultValue,
  ContainerChartAndTopics,
  ContainerTopicBoxLeft,
  ContainerTopicBoxRight,
  BoxTopicLeft1,
  BoxTopicLeft2,
  BoxTopicLeft3,
  BoxTopicRight1,
  BoxTopicRight2,
  ContainerTitleBox,
  ContainerTitleBoxApillar,
  ContainerTitleBoxBenchmark,
  TitleBoxManagementsicht,
  TitleBoxIhreKundensicht,
  TitleBoxBenchmark,
  TopLineFloatingDiv,
  FloatingDiv,
} from './styles';

const textKundenwirkungHover = [
  'Kundenvertrauen',
  'Loyalität',
  'Zufriedenheit mit den angebotenen Leistungen und Services',
];

const textKundeninteraktionHoverManagementsichtLeft = [
  `Produkt - und Dienstleistungsangebot`,
  `Customer Experience`,
  `Informationsaustausch`,
  `Vertrieb`,
];

const textKundeninteraktionHoverManagementsichtRight = [
  `Customer Journey`,
  `Pricing`,
  `Branding`,
  `Erfolgsmessung- und steuerung`,
];

const textKundeninteraktionHoverKundersichtLeft = [
  `Produkt - und Dienstleistungsangebot`,
  `Customer Experience`,
  `Informationsaustausch`,
  `Vertrieb`,
];

const textKundeninteraktionHoverKundersichtRight = [
  `Customer Journey`,
  `Pricing`,
  `Branding`,
  `Erfolgsmessung- und steuerung`,
];

const textUnternehmenssteuerungHover = [
  'Organisationsgestaltung',
  '(digitale) Strategie',
  'Führung',
  'Mitarbeiter-Empowerment',
];

const textRahmenbedingungenHover = [
  'Top Management Commitment',
  'Unternehmenskultur',
];

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

const ChartAndTopicsComponent: React.FC<Props> = ({
  aPillarTitles,
  topicValueScores,
  customerOrientationIndex,
}) => {
  return (
    <>
      <ContainerChartAndTopics>
        <ContainerTopicBoxLeft>
          <BoxTopicLeft1>
            <FloatingDiv>
              <TopLineFloatingDiv color={'#2D7D88'}>
                <span>{`Kundeninteraktion  (Managementsicht)`}</span>
              </TopLineFloatingDiv>
              <ul>
                {textKundeninteraktionHoverManagementsichtLeft.map(
                  (text, index) => {
                    return (
                      <li key={index}>
                        <span>{text}</span>
                      </li>
                    );
                  },
                )}
              </ul>
              <ul>
                {textKundeninteraktionHoverManagementsichtRight.map(
                  (text, index) => {
                    return (
                      <li key={index}>
                        <span>{text}</span>
                      </li>
                    );
                  },
                )}
              </ul>
            </FloatingDiv>
            <span>
              {
                topicValueScores.filter(
                  topic => topic.rowOrder === 1 && topic.columnSide === 'left',
                )[0]?.name
              }
            </span>
          </BoxTopicLeft1>

          <BoxTopicLeft2>
            <FloatingDiv>
              <TopLineFloatingDiv color={'#2D7D88'}>
                <span>{`Unternehmenssteuerung`}</span>
              </TopLineFloatingDiv>
              <ul>
                {textUnternehmenssteuerungHover.map((text, index) => {
                  return (
                    <li key={index}>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </FloatingDiv>
            <span>
              {
                topicValueScores.filter(
                  topic => topic.rowOrder === 2 && topic.columnSide === 'left',
                )[0]?.name
              }
            </span>
          </BoxTopicLeft2>

          <BoxTopicLeft3>
            <FloatingDiv>
              <TopLineFloatingDiv color={'#2D7D88'}>
                <span>{`Rahmenbedingungen`}</span>
              </TopLineFloatingDiv>
              <ul>
                {textRahmenbedingungenHover.map((text, index) => {
                  return (
                    <li key={index}>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </FloatingDiv>
            <span>
              {
                topicValueScores.filter(
                  topic => topic.rowOrder === 3 && topic.columnSide === 'left',
                )[0]?.name
              }
            </span>
          </BoxTopicLeft3>
        </ContainerTopicBoxLeft>

        <ChartContainer>
          <ContainerTitleBox>
            <ContainerTitleBoxApillar>
              <TitleBoxManagementsicht>
                {
                  aPillarTitles.filter(
                    apillar =>
                      apillar.rowOrder === 1 && apillar.columnSide === 'left',
                  )[0]?.title
                }
              </TitleBoxManagementsicht>

              <TitleBoxIhreKundensicht>
                {
                  aPillarTitles.filter(
                    apillar =>
                      apillar.rowOrder === 1 && apillar.columnSide === 'right',
                  )[0]?.title
                }
              </TitleBoxIhreKundensicht>
            </ContainerTitleBoxApillar>

            <ContainerTitleBoxBenchmark>
              <TitleBoxBenchmark>
                <FloatingDiv>
                  <TopLineFloatingDiv color={'#cccccc'}>
                    <span>{`Top 10 Unternehmen`}</span>
                  </TopLineFloatingDiv>
                  <ul>
                    <li>
                      <span>
                        {`Befragungsergebnisse der besten 10 Teilnehmer:innen
                          der Erhebung 2022`}
                      </span>
                    </li>
                  </ul>
                </FloatingDiv>
                Top 10 Unternehmen
              </TitleBoxBenchmark>
            </ContainerTitleBoxBenchmark>
          </ContainerTitleBox>

          <ValuesContainer>
            <ValuesHorizontalContainer
              marginTop="33px"
              widthMedia="100%"
              marginTopMedia="6px"
            >
              <ValueGrayRight1>
                <span>90</span>
              </ValueGrayRight1>
              <ValuePurple>
                <span>
                  {topicValueScores.filter(
                    topic =>
                      topic.rowOrder === 1 && topic.columnSide === 'right',
                  )[0]?.value !== -99
                    ? topicValueScores.filter(
                        topic =>
                          topic.rowOrder === 1 && topic.columnSide === 'right',
                      )[0]?.value
                    : 'k/a'}
                </span>
              </ValuePurple>
            </ValuesHorizontalContainer>

            <ValuesHorizontalContainer
              marginTop="60px"
              widthMedia="60%"
              marginTopMedia="20px"
            >
              <ValueOrangeLeft>
                <span>
                  {topicValueScores.filter(
                    topic =>
                      topic.rowOrder === 1 && topic.columnSide === 'left',
                  )[0]?.value !== -99
                    ? topicValueScores.filter(
                        topic =>
                          topic.rowOrder === 1 && topic.columnSide === 'left',
                      )[0]?.value
                    : 'k/a'}
                </span>
              </ValueOrangeLeft>

              <ValueGrayLeft1>
                <span>83</span>
              </ValueGrayLeft1>

              <ValueGrayRight2>
                <span>86</span>
              </ValueGrayRight2>

              <ValueOrangeRight>
                <span>
                  {topicValueScores.filter(
                    topic =>
                      topic.rowOrder === 2 && topic.columnSide === 'right',
                  )[0]?.value !== -99
                    ? topicValueScores.filter(
                        topic =>
                          topic.rowOrder === 2 && topic.columnSide === 'right',
                      )[0]?.value
                    : 'k/a'}
                </span>
              </ValueOrangeRight>
            </ValuesHorizontalContainer>

            <ValuesHorizontalContainer
              marginTop="77px"
              widthMedia="60%"
              marginTopMedia="30px"
            >
              <ValueBlue>
                <span>
                  {topicValueScores.filter(
                    topic =>
                      topic.rowOrder === 2 && topic.columnSide === 'left',
                  )[0]?.value !== -99
                    ? topicValueScores.filter(
                        topic =>
                          topic.rowOrder === 2 && topic.columnSide === 'left',
                      )[0]?.value
                    : 'k/a'}
                </span>
              </ValueBlue>
              <ValueGrayLeft2>
                <span>88</span>
              </ValueGrayLeft2>
            </ValuesHorizontalContainer>

            <ValuesHorizontalContainer
              marginTop="85px"
              widthMedia="60%"
              marginTopMedia="30px"
            >
              <ValueGreen>
                <span>
                  {topicValueScores.filter(
                    topic =>
                      topic.rowOrder === 3 && topic.columnSide === 'left',
                  )[0]?.value !== -99
                    ? topicValueScores.filter(
                        topic =>
                          topic.rowOrder === 3 && topic.columnSide === 'left',
                      )[0]?.value
                    : 'k/a'}
                </span>
              </ValueGreen>

              <ValueGrayLeft3>
                <span>88</span>
              </ValueGrayLeft3>
            </ValuesHorizontalContainer>
          </ValuesContainer>

          <BoxFinalResultText>
            <span>CUSTOMER ORIENTATION INDEX</span>
          </BoxFinalResultText>

          <BoxFinalResultValue>
            <span>
              {customerOrientationIndex === -99
                ? 'k/a'
                : customerOrientationIndex}
            </span>
          </BoxFinalResultValue>
        </ChartContainer>

        <ContainerTopicBoxRight>
          <BoxTopicRight1>
            <FloatingDiv>
              <TopLineFloatingDiv color={'#9B4578'}>
                <span>{`Kundenwirkung`}</span>
              </TopLineFloatingDiv>
              <ul>
                {textKundenwirkungHover.map((text, index) => {
                  return (
                    <li key={index}>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </FloatingDiv>
            <span>
              {
                topicValueScores.filter(
                  topic => topic.rowOrder === 1 && topic.columnSide === 'right',
                )[0]?.name
              }
            </span>
          </BoxTopicRight1>

          <BoxTopicRight2>
            <FloatingDiv>
              <TopLineFloatingDiv color={'#9B4578'}>
                <span>{`Kundeninteraktion (Kundensicht)`}</span>
              </TopLineFloatingDiv>
              <ul>
                {textKundeninteraktionHoverKundersichtLeft.map(
                  (text, index) => {
                    return (
                      <li key={index}>
                        <span>{text}</span>
                      </li>
                    );
                  },
                )}
              </ul>
              <ul>
                {textKundeninteraktionHoverKundersichtRight.map(
                  (text, index) => {
                    return (
                      <li key={index}>
                        <span>{text}</span>
                      </li>
                    );
                  },
                )}
              </ul>
            </FloatingDiv>
            <span>
              {
                topicValueScores.filter(
                  topic => topic.rowOrder === 2 && topic.columnSide === 'right',
                )[0]?.name
              }
            </span>
          </BoxTopicRight2>
        </ContainerTopicBoxRight>
      </ContainerChartAndTopics>
    </>
  );
};

export default ChartAndTopicsComponent;
