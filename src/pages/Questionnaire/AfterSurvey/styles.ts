import styled, { css } from 'styled-components';
import cardTso from '../../../assets/card-tso.png';

export const Header = styled.header`
  width: 100%;
  height: 175px;
  //background-color: #f08827;
  background-color: #e0e0e0;
  text-align: center;
  line-height: 300%;
  padding: 10px 0;
  position: fixed;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
  }

  ${css`
    background-image: url(https://www.top-service-oesterreich.at/wp-content/themes/yootheme/cache/start-hero-bg-987d0498.webp);
    background-size: 100%;
    background-position: 50% 50%;

    background-repeat: no-repeat;
  `}

  span {
    color: #fff;
    font-size: 2.5rem;
  }
`;

export const Content = styled.div`
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100%;
  padding: 10px;
  /* padding-bottom: 70px; */
  @media (max-width: 500px) {
    padding-bottom: 140px;
    min-height: 105%;
  }

  @media (max-height: 900px) {
    min-height: 125%;
  }
`;

export const CircleNumber = styled.div`
  position: relative;
  background-color: #787878;
  bottom: -35px;
  border-radius: 100%;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 3rem;
    color: white;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: white;
  ${css`
    background: url(${cardTso}) no-repeat 50%;
  `}

  text-decoration: none;
  color: #444;

  min-height: 650px;
  background-size: 350px 600px;

  width: 33%;
  min-width: 300px;

  margin-top: 3rem;
`;

export const BoxVideo = styled.div`
  width: 245px;
  height: 145px;
  margin-top: 60px;
`;

export const TextGrayImgPosition1 = styled.div`
  color: #fff;
  width: 250px;
  text-align: center;
  margin-top: 65px;

  text-align: center;
  font-size: 1rem;

  line-height: 25px;
`;

export const TextGrayImgPosition2 = styled.div`
  color: #fff;
  width: 250px;
  text-align: center;
  margin-top: 65px;
  text-align: center;
  font-size: 1rem;
  line-height: 25px;
`;

export const TextGrayImgPosition3 = styled.div`
  color: #fff;
  width: 250px;
  text-align: center;
  margin-top: 65px;
  text-align: center;
  font-size: 1rem;
  line-height: 25px;
`;

export const TextRedImgPosition1 = styled.div`
  color: #fff;
  margin-top: 145px;
  text-align: left;
  font-size: 1.4rem;
  width: 15rem;
`;

export const TextRedImgPosition2 = styled.div`
  color: #fff;
  margin-top: 145px;
  text-align: left;
  font-size: 1.4rem;
  width: 15rem;
`;

export const TextRedImgPosition3 = styled.div`
  color: #fff;
  margin-top: 145px;
  text-align: left;
  font-size: 1.4rem;
  width: 15rem;
`;

export const Button = styled.div`
  display: flex;
  width: 200px;
  height: 55px;
  color: #fff;
  background-color: #c00000;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-top: 145px;
`;

export const BoxShareSocialMedia = styled.div`
  background-color: #fff;
  height: 0px;
  margin-top: 160px;
  margin-bottom: 45px;
`;

export const FooterBoxLinkedin = styled.div`
  display: flex;
  div {
    margin-right: 1rem;
  }
  p {
    line-height: 110%;
    font-weight: normal;
    font-size: 0.95rem;
  }
`;

export const DivTso = styled.div`
  padding: 6px 6px 2px 6px;
  background-color: white;
`;

export const Footer = styled.footer`
  width: 100%;
  height: 80px;
  display: flex;
  padding: 1rem;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;

  ${css`
    background-image: url(https://www.top-service-oesterreich.at/wp-content/themes/yootheme/cache/start-hero-bg-987d0498.webp);
    background-size: 100%;
    background-position: 50% 50%;

    background-repeat: no-repeat;
  `}

  p {
    /* color: rgb(192, 0, 0); */
    color: white;
  }

  @media (max-width: 500px) {
    p {
      display: none;
    }
  }
`;
