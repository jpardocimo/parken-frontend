import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);

  align-items: stretch;
  justify-content: center;
  z-index: 1;
`;

export const Content = styled.div`
  flex: 1;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 10px;
  padding-bottom: 53px;

  margin-left: 15%;
  margin-right: 18%;
  border: 2px solid gray;
  border-radius: 6px;

  margin-top: 15%;
  margin-bottom: 25%;
  border: 2px solid gray;
  border-radius: 8px;
  background-color: #ffffff;

  h2 {
    margin-top: 5px;
    margin-left: 10px;
    border-top: 1px;
    border-bottom: 1px solid #eeeeee;
  }
`;

export const Footer = styled.div`
  vertical-align: bottom;
  margin-bottom: 3px;
`;

export const Title = styled.div`
  margin: 0;
`;

export const Body = styled.div`
  height: auto;
  margin-top: 50px;
  border-top: 1px;
  border-bottom: 1px solid #eeeeee;
`;
