import styled, { keyframes, css } from 'styled-components';

interface ChartProps {
  APillarName: 'apillar1' | 'apillar2';
  imageBackGround?: string;
}

export const Wrap = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 35px auto;
  padding: 0 10px;

  h3 {
    margin-left: 70px;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 640px;

  @media (max-width: 1126px) {
    flex-direction: column;
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

export const ChartContainer = styled.div<ChartProps>`
  width: 710px;
  padding: 0 44px;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */

  background: url(${props => props.imageBackGround}) no-repeat 74px 55px;
  animation: ${appearFromLeft} 1s;

  @media (max-width: 1126px) {
    width: 100%;
    padding: 0;
    background-size: contain;
    background-position: center 40px;
    padding-bottom: 50px;
  }
`;

export const LeftContainer = styled.div`
  position: relative;
`;

export const TextContainer = styled.div`
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 70px auto 0;

  animation: ${appearFromRight} 1s;

  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
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

export const Score = styled.span`
  font-size: 28px;
  color: #28000a;
  font-weight: bold;
`;

export const Body = styled.div`
  width: 100%;
  padding: 20px 30px;
`;

export const BodyLine = styled.div<ChartProps>`
  display: flex;

  h3 {
    margin-bottom: 30px;
    font-size: 19px;
  }

  h4 {
    flex: 1;
    margin-right: 20px;
    margin-bottom: 30px;
  }

  ${props =>
    props.APillarName === 'apillar2' &&
    css`
      &:last-child {
        h4 {
          border-top: 1px solid #999;
        }
      }
    `}
`;

export const RefreshButton = styled.button`
  border: 0 none;
  background-color: transparent;
  display: inline-flex;
  margin: 0 190px 0 0;
  float: right;

  &:hover {
    opacity: 0.7;
  }
`;

export const ButtonLeft = styled.button`
  border: 0 none;
  background-color: transparent;
  position: absolute;
  top: 170px;
  left: -55px;

  &:hover {
    opacity: 0.7;
  }
`;

export const ButtonRight = styled.button`
  border: 0 none;
  background-color: transparent;
  position: absolute;
  top: 170px;
  right: -55px;

  &:hover {
    opacity: 0.7;
  }
`;

export const BottomContainer = styled.div`
  margin: 20px 0 40px;

  p {
    margin: 10px 0 0;
    font-size: 13px;
  }
`;

export const BoxFooter = styled.div`
  background-color: rgb(244, 244, 244);
  padding: 14px;
  margin: 20px 0 0;

  ul {
    margin: 5px 30px;

    li {
      a {
        color: #017698;
        text-decoration: underline;
        margin-left: 5px;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;
