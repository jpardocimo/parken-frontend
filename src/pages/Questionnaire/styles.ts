import styled, { css } from 'styled-components';
import Button from '../../components/Button';

interface ContainerProps {
  useStyle: boolean;
  mainColor: string; // b31c1d ->TSO
  showFinalMessage: boolean;
}

interface HeaderProps {
  useStyle: boolean;
  headerColor: string;
  sizeLogo: string;
}

interface ButtonStyle {
  buttonColor: string;
}

function getCss(buttonColor: string, displayFinalMessage: string): any {
  const cssTso = `

  @media (max-width: 844px){
    .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-question table.sv-matrix-root .sv-matrix__cell, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-row__question table.sv-matrix-root .sv-matrix__cell {
      text-align: initial !important;
      margin-left: 20px;
    }
    td .sv-string-viewer {
      font-weight: 700;
    }
  }

  @media (max-width: 844px){
    .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-question table.sv-table tbody, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-question table.sv-table tr, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-question table.sv-table td, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-row__question table.sv-table tbody, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-row__question table.sv-table tr, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-row__question table.sv-table td {
      display: block;
    }

    .sv-root-modern .sv-table th {
        display: none !important;
      }

      .sv-table .sv-table__cell {
        padding-top: 0.875em;
        margin-top: 0px;
    }

    .sv-table__cell {
      padding: 10px;
      box-sizing: content-box;
      vertical-align: top;
    }

    .sv-table tbody tr .sv-table__cell {
      padding-bottom: 1.5em!important;
    }

    .sv-table tr:first-child .sv-table__cell {
      padding-top: 0.875em;
  }

  }

  @media (max-width: 844px){
    .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-question table.sv-matrix-root td:after, .sv-root-modern .sv-container-modern .sv-body .sv-page .sv-row .sv-row__question table.sv-matrix-root td:after {
      content: attr(data-responsive-title) !important;
    }

    .sv-table tbody tr .sv-table__cell {
      padding-bottom: 1.5em!important;
    }
  }

  .sv-root-modern .sv-container-modern__title {
    color: ${buttonColor} !important;
  }

  .sv-root-modern .sv-container-modern__title {
    color:${buttonColor} !important;
  }

  .sv-root-modern .sv-btn--navigation {
    background-color: ${buttonColor} !important;
  }

 .sv-root-modern .sv-checkbox--checked .sv-checkbox__svg {
      background-color: ${buttonColor}bf !important;
      fill: rgb(255, 255, 255);
  }

  .sv-root-modern .sv-question__title--answer {
    background-color: ${buttonColor}0f !important;
  }

  .sv-root-modern .sv-progress__bar {
    background-color: ${buttonColor} !important;
  }

  .sv-root-modern ::-webkit-scrollbar-thumb {
    background: ${buttonColor} !important;
  }

  .sv-root-modern ::-webkit-scrollbar-thumb {
    background: #284158 !important;
  }

  .sv-root-modern .sv-comment:focus {
    border-color: #284158 !important;
  }

  .br-theme-css-stars .br-widget a.br-selected:after {
    color: ${buttonColor}bf !important;
  }

  .br-theme-fontawesome-stars-o .br-widget a.br-selected:after{
    color: ${buttonColor}bf !important;
  }

  .br-theme-fontawesome-stars .br-widget a.br-selected:after {
    color: ${buttonColor}bf !important;
  }

  .noUi-connect {
    background: ${buttonColor}bf !important;
  }

  .sv-root-modern .sv-rating__item--selected .sv-rating__item-text {
    background-color: ${buttonColor}bf !important;
    color: rgb(255, 255, 255);
    border-color: ${buttonColor}bf !important;
  }

  .body {
    --primary-color: ${buttonColor} !important;
    --secondary-color: ${buttonColor} !important;
    --primary-text-color: #676a6c !important;
    --secondary-text-color: #a7a7a7 !important;
    --inverted-text-color: #ffffff !important;
    --primary-hover-color: ${buttonColor} !important;
    --selection-border-color: ${buttonColor} !important;
    --primary-icon-color: #3d4d5d !important;
    --primary-bg-color: #fff !important;
    --secondary-bg-color: #f4f4f4 !important;
    --primary-border-color: #e7eaec !important;
    --secondary-border-color: #ddd !important;
    --error-color: #ed5565 !important;
  }

  .br-theme-bars-pill .br-widget a {
    padding: 7px 15px;
     background-color: ${buttonColor}9f !important;
    font-size: 13px;
    line-height: 3;
    text-align: center;
    font-weight: 400;
  }

  .br-theme-bars-movie .br-widget a.br-active, .br-theme-bars-movie .br-widget a.br-selected {
    background-color:  ${buttonColor} !important;
    color: rgb(206, 206, 206);
  }

  .br-theme-bars-square .br-widget a.br-active, .br-theme-bars-square .br-widget a.br-selected {
    border: 2px solid  ${buttonColor} !important;
  }

  .br-theme-bars-movie .br-widget a {
    display: block;
    text-align: center;
    width: 130px;
    height: 25px;
    float: left;
    background-color: ${buttonColor}7f !important;
    margin: 1px;
    color: rgb(70, 71, 71);
  }

  .br-theme-bars-square .br-widget a {
    display: block;
    width: 30px;
    height: 30px;
    float: left;
    border: 2px solid ${buttonColor}6f !important;
    background-color: white;
    margin: 2px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    line-height: 2;
    text-align: center;
    color: #bbcefb;
    font-weight: 600;
  }

  .br-theme-bars-reversed .br-widget a {
    display: block;
    width: 22px;
    height: 22px;
    float: left;
    background-color: ${buttonColor}9f !important;
    margin: 1px;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.4;
    color: red;
    text-align: center;
  }

  .br-theme-bars-pill .br-widget a.br-active, .br-theme-bars-pill .br-widget a.br-selected {
    background-color: ${buttonColor} !important;
    color: white;
  }

  .br-theme-bars-reversed .br-widget a.br-active, .br-theme-bars-reversed .br-widget a.br-selected {
      background-color: ${buttonColor} !important;
      color: white;
  }

  .sv-question {
    overflow: visible;
  }

  .noUi-value-horizontal {
    overflow-wrap: break-word;
    hyphens: manual;
    white-space: normal;
    top: 0;
    height: inherit;
  }

  .sv-item.sv-radio.sv-selectbase__item.sv-q-col-1.sv-radio--checked {
    background-color: ${buttonColor}1f !important;
  }

  .sv-btn.sv-action-bar-item, .sv-btn {
    appearance: none;
    border: none;
    border-radius: 1.214em;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875em;
    font-weight: bold;
    outline: none;
    padding: 0.5em 1.786em 0.6em;
    text-align: left;
}

  .sv-completedpage {
    padding-top: 25px!important;
    padding-bottom: 5px!important;
    height: auto!important;
    line-height: 1.3em!important;
    display: ${displayFinalMessage};
  }

  .sv-root-modern .sv-rating input:focus + .sv-rating__min-text + .sv-rating__item-text, .sv-rating input:focus + .sv-rating__item-text {
    outline-color: white;
   }

  .sv-root-modern .sv-rating__item-text {
    color: #4D4646;
    border: 0.1875em solid ${buttonColor};
  }

  @media (max-width: 1126px) {
   .sv-header__text{
     margin-left: 50px;
   }
  }

  @media (max-width: 700px) {

    .br-theme-bars-pill .br-widget {
      white-space: nowrap;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: center;
      align-items: stretch;
    }

    .br-theme-bars-pill .br-widget a:first-child {
      -webkit-border-top-left-radius: 999px;
      -webkit-border-top-right-radius: 999px;
      border-bottom-left-radius: 0;
      bordert-top-left-radius: 0;
    }

    .br-theme-bars-pill .br-widget a:last-child {
      border-bottom-left-radius: 0 !important;
      bordert-top-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-top-right-radius: 0 !important;
    }

    .sv-container-modern fieldset {
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-items: baseline;
    }

    .sv-rating__item {
      width:100%;
    }

    .sv-root-modern .sv-rating__item-text {
      width:100%;
    }


    .sv-rating__item-text > span {
      margin: 0.44em 0;
    }
  }

`;
  return cssTso;
}

export const Header = styled.header<HeaderProps>`
  width: 100%;
  height: 75px;
  background: ${props => (props.useStyle ? props.headerColor : '#e0e0e0')};
  /* background-color: #e0e0e0; */
  padding: 10px 0;
  position: fixed;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 30%);
  overflow: hidden;

  img {
    max-height: ${props => (props.useStyle ? props.sizeLogo : '100%')};
  }
`;

export const HeaderImage = styled.header<HeaderProps>`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  height: 75px;

  img {
    &.backgroundHeader {
      z-index: 1000;
      width: 100%;
      height: 75px;
      object-fit: cover;
      object-position: 0 0;
    }
  }

  div {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
    height: 75px;

    img {
      max-height: ${props => (props.useStyle ? props.sizeLogo : '100%')};
    }
  }
`;

export const Container = styled.div<ContainerProps>`
  /* max-width: 1260px; */
  max-width: 90%;
  @media (max-width: 1300px) {
    max-width: 100%;
  }

  margin: 0 auto;
  padding: 0 24px 24px;
  position: relative;
  top: 40px;

  ${props =>
    props.useStyle
      ? css`
          ${getCss(
            props.mainColor,
            props.showFinalMessage ? 'block !important' : 'none',
          )}
        `
      : ''};

  .button-fortfahren {
    font-weight: 500px;
    margin-top: 16px;
    margin-right: 35px;
    width: 200px;
    height: 35px;
    background: #47283a;
    color: #ffff;
    display: block;
    padding: 0 16px;
    border: 0px;
    border-radius: 10px;
    box-shadow: none;
    transition: 0.2s ease 0s;
    &:hover {
      background: #5c344ceb;

      color: #eeee;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  top: 60px;

  p {
    margin: 12px 0;
  }

  p.title {
    font-size: 1.2em;
    font-weight: bold;
  }

  p.small {
    font-size: 12px;
    margin: 10px 0 30px;
  }

  div.text,
  svg {
    line-height: 50px;
    vertical-align: middle;
    font-size: 30px;
  }
`;

export const Footer = styled.footer``;

export const ButtonMoreInfo = styled(Button)`
  width: 200px;
  height: 35px;
  background: #0000000d;
  padding: 10px 15px;
  font-size: x-small;
  text-decoration: none;
  color: #2289bd;
  margin: 0 0 25px;
  display: block;
  float: right;

  &:hover {
    background: #efefef;
    color: #8ec1db;
    opacity: 0.8;
  }
`;

export const ButtonNext = styled(Button)<ButtonStyle>`
  margin-right: 35px;
  width: 200px;
  height: 35px;
  color: #ffff;
  display: block;

  /* background: #47283a; */
  background: ${props => (props.buttonColor ? props.buttonColor : '#47283a')};

  &:hover {
    /* opacity: 0.8;
    color: #eeee; */
    background: ${props =>
      props.buttonColor ? `${props.buttonColor}8f` : 'blue'};
  }
`;

export const GDPRText = styled.p`
  font-size: x-small;
  color: #aaa;
  margin: 50px 0 30px !important;

  a {
    color: #017698;
    text-decoration: underline;
    margin-left: 5px;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const AlertMessage = styled.div`
  margin: 100px 0;
  padding: 24px;
  color: #3172b7;
  background-color: #ebf8ff;
  border-color: #3172b7;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  flex-direction: column;

  svg {
    margin-right: 24px;
  }
`;

export const AlertMessageLeaving = styled.div`
  margin: auto;
  padding: 24px;
  color: #3172b7;
  background-color: #ebf8ff;
  border-color: #3172b7;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  flex-direction: column;

  svg {
    margin-right: 24px;
  }
`;
