import styled from 'styled-components';
import { Button as Btn } from '@material-ui/core';
import Modal from '../../../components/Modal/Modal';

export const SurveyModal = styled(Modal)`
  width: 55%;
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 17%;
  margin-right: 3.5%;
  height: 500px;
  border: 2px solid gray;
  border-radius: 8px;
  background-color: #ffffff;
`;

export const Container = styled.div``;

export const Content = styled.div``;

export const Button = styled(Btn)`
  margin: 20px 0 15px !important;
  background-color: #00a65a !important;
  color: #fff !important;
`;

export const BoxRow = styled.div`
  display: flex;
  align-items: center;

  &:first-child {
    margin: 20px 0 0;
    font-size: 20px;
  }
`;

export const BoxCol = styled.div`
  flex: 1;
  text-align: center;
  margin: 14px 0;
`;

export const BoxColTitle = styled.div`
  flex: 1;
  text-align: center;
  margin: 14px 0;
  padding: 12px 0;
  border-radius: 4px;
  background-color: #f6f6f6;
`;

export const ModalProduct = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    justify-content: center;
    align-items: center;

    overflow-x: hidden;

    height: 250px;
    width: 300px;
    padding-left: 10px;
    padding-right: 10px;

    border: 2px solid gray;
    border-radius: 8px;
    background-color: #ffffff;
    div {
      padding: 1px;
    }
    h2 {
      margin-top: 5px;
      margin-left: 10px;
      border-top: 1px;
      border-bottom: 1px solid #eeeeee;
    }
  }
`;
