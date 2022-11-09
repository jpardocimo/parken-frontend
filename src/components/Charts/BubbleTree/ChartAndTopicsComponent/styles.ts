import styled, { css, keyframes } from 'styled-components';
import topicBubbles from '../../../../assets/TopicBubbles2Colors.svg';
import topicBubbles1126 from '../../../../assets/TopicBubbles2Colors1126.svg';

interface TooltipProps {
  topLineColor?: string;
  color?: string;
  width?: string;
  height?: string;
  visible?: boolean;
}

interface ContainerHorizontalValues {
  marginTop?: string;
  marginTopMedia?: string;
  widthMedia?: string;
}

export const FloatingDiv = styled.div<TooltipProps>`
  display: none;
  width: auto;
  height: auto;
  background-color: #eeeeee;
  //visibility: hidden;
  border: 1px solid #cfcfcf;
  padding: 1.2rem;
  border-radius: 10px;
  z-index: 10;
  ul {
    margin-top: 30px;
  }
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ChartContainer = styled.div`
  ${css`
    background: url(${topicBubbles}) no-repeat 15px 10px;
  `}

  @media (max-width: 1126px) {
    ${css`
      background: url(${topicBubbles1126}) no-repeat 100px 11px;
    `}
  }
  display: flex;
  flex-direction: column;

  height: auto;
  margin: auto;

  align-content: flex-start;
  justify-content: flex-start;

  animation: ${appearFromLeft} 1s;
  margin-top: 100px;
  width: 411px;
`;

export const ContainerTitleBox = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -120px;
  margin-bottom: 0px;
  margin-left: -75px;
  width: max-content;
  @media (max-width: 1126px) {
    margin: -120px 0 0 20px;
  }
`;

export const ValuesContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: auto;
  width: 100%;
  align-items: flex-start;
  @media (max-width: 1126px) {
    margin-left: 14px;
  }
`;

export const ValuesHorizontalContainer = styled.div<ContainerHorizontalValues>`
  display: flex;
  flex-direction: row;
  height: auto;
  width: 100%;
  margin: ${props => (props.marginTop ? props.marginTop : '10px')} 0 0 0;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 1126px) {
    margin: ${props => (props.marginTopMedia ? props.marginTopMedia : '10px')} 0
      0 0;
    width: ${props => (props.widthMedia ? props.widthMedia : '100%')};
  }
`;

export const ContainerChartAndTopics = styled.div`
  display: flex;
  height: 782px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;
  @media (max-width: 1126px) {
    height: 60%;
    margin-left: -11px;
    width: 53%;
  }
`;

export const ContainerTitleBoxApillar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ContainerTitleBoxBenchmark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleBoxManagementsicht = styled.div`
  background: #2d7d88;
  color: #fff;
  padding: 5px 15px;
  margin: 20px 45px 20px 45px;
  font-size: 1rem;
  width: 195px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;

  @media (max-width: 1126px) {
    font-size: 0.7rem;
    width: 145px;
    margin: 20px 45px 20px 8px;
    padding: 5px 10px 5px 13px;
  }
`;

export const TitleBoxIhreKundensicht = styled.div`
  display: flex;
  flex1;
  background: #9b4578;
  color: #fff;
  padding: 5px 15px;
  margin: 20px 45px 20px 45px;
  font-size: 15px;
  width: 185px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;

  @media (max-width: 1126px) {
    font-size: 0.7rem;
    width: 145px;
    margin: 20px 45px 20px 15px;
    padding: 5px 15px 5px 9px;
  }
`;

export const TitleBoxBenchmark = styled.div`
  display: flex;
  flex1;
  background: #cccccc;
  color: #fff;
  padding: 5px 15px;
  margin: 7px 0;
  font-size: 15px;
    width: 185px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  span {
    font-size: 1.2rem;
    color: #666666;
  }
  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 32%;
    left: 8%;

    padding-left: 2rem;
    visibility: visible;

    ul {
      color: #666666!important;
    }
  }

  @media (max-width: 1126px) {
    font-size: 0.7rem;
    width: 135px;
    margin: 5px 45px 20px 12px;
    padding: 5px 10px 5px 13px;
  }
`;

export const ContainerTopicBoxLeft = styled.div`
  display: flex;
  //flex: 1;
  width: auto;
  height: 355px;
  flex-direction: column;
  margin-top: 12px;
  @media (max-width: 1126px) {
    margin-top: 25px;
    margin-left: 7px;
  }
`;

export const ContainerTopicBoxRight = styled.div`
  display: flex;
  //flex: 1;
  width: auto;
  height: 570px;
  flex-direction: column;
  align-content: flex-start;
  margin-top: 18px;
`;

export const TopLineFloatingDiv = styled.div<TooltipProps>`
  position: absolute;
  width: 100%;
  height: auto;
  margin-top: 25px;
  top: 0;
  left: 0;
  margin: 0;
  background-color: ${props => props.color};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  padding: 8px;

  & span {
    color: #fff !important;
  }
`;

export const BoxTopicLeft1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  height: 35px;
  margin: 0 0 20px 53px;
  order: 1;

  span {
    font-size: 1.2rem;
    color: #666666;
    @media (max-width: 1126px) {
      z-index: 1;
      font-size: 0.5rem;
      margin: 150px -106px 0 22px;
    }
  }

  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 37%;
    left: 8%;

    padding-left: 2rem;
    visibility: visible;
    @media (max-width: 1126px) {
      width: 365px;
      display: flex;
      visibility: visible;
      top: 22%;
      left: 3%;

      padding-left: 30px;
      span {
        font-size: 0.7rem;
        //margin: 28px 0 21px 30px;
        margin: 28px 0 8px 0;
      }
    }
  }
`;

export const BoxTopicLeft2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  height: 35px;
  margin: 60px 0 0 0;

  order: 2;
  span {
    font-size: 1.2rem;
    color: #666666;
    @media (max-width: 1126px) {
      z-index: 1;
      font-size: 0.5rem;
      margin: 36px -98px 0 0;
    }
  }
  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 46%;
    left: 8%;

    padding-left: 2rem;
    visibility: visible;
    @media (max-width: 1126px) {
      width: 365px;
      display: flex;
      visibility: visible;
      top: 26%;
      left: 3%;

      padding-left: 30px;
      span {
        font-size: 0.7rem;
        //margin: 28px 0 21px 30px;
        margin: 28px 0 8px 0;
      }
    }
  }
`;

export const BoxTopicLeft3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  height: 35px;
  margin: 85px 0 0 0;

  order: 3;
  span {
    font-size: 1.2rem;
    color: #666666;
    @media (max-width: 1126px) {
      z-index: 1;
      font-size: 0.5rem;
      margin: 0px -95px 77px 0;
    }
  }
  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 59%;
    left: 8%;

    padding-left: 2rem;
    visibility: visible;
    @media (max-width: 1126px) {
      display: flex;
      visibility: visible;
      top: 29%;
      left: 3%;

      width: 370px;
      //padding-left: 40px;
      span {
        font-size: 0.7rem;
        //margin: 28px 0 21px 30px;
        margin: 28px 0 8px 0;
      }
    }
  }
`;

export const BoxTopicRight1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  height: 35px;
  margin: 15px 0 0 0;

  order: 1;
  span {
    font-size: 1.2rem;
    color: #666666;
  }
  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 32%;
    left: 8%;
    padding-left: 2rem;
    visibility: visible;

    @media (max-width: 1126px) {
      display: flex;
      visibility: visible;
      top: 19%;
      left: 5%;

      width: 365px;
      padding-left: 50px;
      span {
        font-size: 0.7rem;
        //margin: 28px 0 21px 30px;
        margin: 28px 0 8px 0;
      }
    }
  }

  @media (max-width: 1126px) {
    margin: 133px 0 0 0;
    font-size: 0.7rem;
    span {
      font-size: 0.5rem;
      //margin: 28px 0 21px 30px;
      margin: 28px 0 21px -102px;
    }
  }
`;

export const BoxTopicRight2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  height: 35px;
  margin: 55px 0 0 0;
  order: 2;
  span {
    font-size: 1.2rem;
    color: #666666;
  }

  &: hover ${FloatingDiv} {
    width: 730px;
    display: flex;
    align-items: space-between;
    justify-content: space-between;
    position: absolute;
    top: 37%;
    left: 8%;
    padding-left: 2rem;
    visibility: visible;
    @media (max-width: 1126px) {
      display: flex;
      visibility: visible;
      top: 22%;
      left: 5%;

      width: 370px;
      padding-left: 40px;
      span {
        font-size: 0.7rem;
        //margin: 28px 0 21px 30px;
        margin: 28px 0 8px 0;
      }
    }
  }

  @media (max-width: 1126px) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    span {
      font-size: 0.5rem;
      //margin: -23px 0 56px -8px;
      margin: -23px 0 56px -102px;
    }
  }
`;

export const ValuePurple = styled.div`
  align-self: flex-start;

  margin-left: 12px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2.3rem;

    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: -25px;
  }
`;

export const ValueGrayRight1 = styled.div`
  align-self: flex-start;

  margin-left: 246px;
  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.1rem;
      width: 66px;
    }
  }
  @media (max-width: 1126px) {
    margin-left: 190px;
    margin-top: 2px;
  }
`;

export const ValueGrayRight2 = styled.div`
  align-self: flex-start;

  margin-left: 84px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.1rem;
      width: 66px;
    }
  }
  @media (max-width: 1126px) {
    margin-left: 13px;
    margin-top: 3px;
  }
`;

export const ValueOrangeRight = styled.div`
  align-self: flex-start;

  margin-left: 12px;
  margin-top: -2px;
  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2.3rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: -24px;
    margin-top: 1px;
  }
`;

export const ValueOrangeLeft = styled.div`
  align-self: flex-start;
  margin-left: 20px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2.3rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: 72px;
    margin-top: 2px;
  }
`;

export const ValueGrayLeft1 = styled.div`
  align-self: flex-start;
  margin-left: 12px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.1rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: -25px;
    margin-top: 3px;
  }
`;

export const ValueBlue = styled.div`
  align-self: flex-start;

  margin-left: 20px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2.3rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: 74px;
    margin-top: 2px;
  }
`;

export const ValueGrayLeft2 = styled.div`
  align-self: flex-start;

  margin-left: 12px;

  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.1rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: -25px;
    margin-top: 2px;
  }
`;

export const ValueGreen = styled.div`
  align-self: flex-start;

  margin-left: 20px;
  margin-top: 6px;
  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2.3rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: 72px;
    margin-top: 7px;
  }
`;

export const ValueGrayLeft3 = styled.div`
  align-self: flex-start;

  margin-left: 12px;
  margin-top: 6px;
  span {
    display: inline-block;
    text-align: center;
    width: 65px;

    font-style: normal;
    font-weight: 500;
    font-size: 2rem;
    color: #ffffff;
    @media (max-width: 1126px) {
      font-size: 1.2rem;
    }
  }
  @media (max-width: 1126px) {
    margin-left: -24px;
    margin-top: 7px;
  }
`;

export const BoxFinalResultText = styled.div`
  height: 40px;
  background: #ffffff;
  margin-top: 118px;
  margin-right: 22px;
  text-align: center;
  span {
    width: auto;
    font-style: normal;
    font-weight: 600;
    font-size: 1.8rem;
    color: #666666;
    text-align: center;
    @media (max-width: 1126px) {
      display: none;
    }
  }
`;

export const BoxFinalResultValue = styled.div`
  height: 20px;
  margin-top: 25px;
  margin-right: 22px;
  background: #ffffff;
  text-align: center;
  span {
    width: 10px;
    font-style: normal;
    font-weight: 600;
    font-size: 2.8rem;
    color: #666666;
    text-align: center;
    @media (max-width: 1126px) {
      display: none;
    }
  }
`;

export const BoxFinalResultTextRightSide = styled.div`
  height: 40px;
  margin-top: 5px;
  text-align: center;
  span {
    width: auto;
    font-style: normal;
    font-weight: 500;
    font-size: 1.7rem;

    text-align: center;
  }
  @media (max-width: 1126px) {
    margin-bottom: 61px;
  }
`;

export const BoxFinalResultValueRightSide = styled.div`
  height: 20px;
  margin-top: 35px;
  text-align: center;
  span {
    width: 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 3rem;

    text-align: center;
  }
`;

export const BottomContainer = styled.div`
  //margin: 20px 0 40px;
  margin: -75px 0 40px;
  p {
    text-align: center;
    margin: 10px 0 0;
    font-size: 13px;
  }

  @media (max-width: 1126px) {
    margin-top: 400px;
  }
`;

export const BoxFooter = styled.div`
  margin: 368px 0 40px;

  background-color: rgb(244, 244, 244);
  padding: 2rem;
  margin: 1rem;
  text-align: center;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

export const Span = styled.span`
  margin: 0;
  font-size: 1.5rem;
  color: #666666;
  h4 {
    font-size: 1.7rem;
    color: #c00000;
  }
`;
