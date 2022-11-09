import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 62px;
`;

export const BoxCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 20%;
  transition: 0.3s;
  margin: 10px;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  a {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  h2,
  h3,
  svg {
    margin: 30px 0 10px;
  }

  h3 {
    margin: 10px 0 30px;
  }
`;
