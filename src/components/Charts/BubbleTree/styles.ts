import styled, { keyframes } from 'styled-components';

interface TooltipProps {
  topLineColor?: string;
  color?: string;
  width?: string;
  height?: string;
}

export const FloatingDiv = styled.div<TooltipProps>`
  display: none;
  width: auto;
  height: auto;
  background-color: #eeeeee;
  visibility: hidden;
  border: 1px solid #cfcfcf;
  padding: 1.2rem;
  border-radius: 10px;
  z-index: 10;
  ul {
    margin-top: 30px;
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const TextContainer = styled.div`
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 0;

  animation: ${appearFromRight} 1s;

  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);

  @media (max-width: 1126px) {
    margin-top: 0;
    margin-left: 0;
    margin-bottom: 0;
  }
`;

export const Wrap = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 35px auto;
  padding: 0 10px;

  h3 {
    margin-left: 70px;
  }

  @media (max-width: 1126px) {
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    display: flex;
    margin-left: 0px;
    align-content: center;
    align-items: center;
    justify-content: normal;
  }
`;

export const LeftContainer = styled.div`
  position: relative;

  @media (max-width: 1126px) {
    //margin-left: 69px;
    //margin-bottom: 0;

    margin-top: -100px;
    margin-left: 0;
    margin-bottom: 0;
  }
`;

export const Header = styled.div`
  background-color: #e3ded1;
  padding: 20px;
`;

export const HeaderLine = styled.div`
  display: flex;
  margin-bottom: 14px;

  h1 {
    font-size: 28px;
    flex: 1;
    margin-right: 20px;
  }
`;

export const Body = styled.div`
  width: 100%;
  padding: 20px 30px;
  line-height: 1.9;
`;

export const Container = styled.div`
  height: 806px;
  display: flex;
  width: 100%;
  min-height: 840px;
  //margin-left: -10px;
  @media (max-width: 1126px) {
    margin-left: 0;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    display: flex;
    align-content: center;
    align-items: center;
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
    margin-top: 200px;
    margin-left: 0;
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
