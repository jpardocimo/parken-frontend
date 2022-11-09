import styled from 'styled-components';

interface BoxProps {
  color: string;
}

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  margin: 50px 0;
`;

export const BoxContent = styled.div``;

export const BoxCard = styled.div<BoxProps>`
  border-radius: 24px;
  margin: 10px 34px;
  padding: 20px 36px;
  flex: 1;
  background-color: ${props => props.color};

  h3 {
    font-size: 42px;
    font-weight: bold;
    color: #000;
    margin: 18px 0;
  }

  span {
    color: #737476;
  }
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

export const FilterSelect = styled.div`
  margin: 0 1%;
  min-width: 22%;
`;
