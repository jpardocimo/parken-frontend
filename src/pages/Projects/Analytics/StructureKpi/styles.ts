import styled from 'styled-components';

export const Container = styled.main``;

export const ContainerTreeKpi = styled.main`
  margin: 10px 0 10px 10px;
  justify-self: stretch;
`;
export const ContainerMainKpi = styled.main`
  display: grid;
  grid-template-columns: calc(100% - 480px) 480px;
`;

export const ContainerCentered = styled.main`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

export const ContainerMenuKpis = styled.div`
  margin: 10px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  justify-self: stretch;
`;

export const ContainerKpiList = styled.main`
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

export const KpiListCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  margin: 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

interface ContainerSelectedKpisProps {
  cardType: 'father' | 'grandfather' | 'question' | 'main';
}

export const ContainerSelectedKpis = styled.div<ContainerSelectedKpisProps>`
  background-color: #fff;
  border-radius: 0.5rem;

  width: ${props =>
    props.cardType === 'grandfather'
      ? '400px'
      : props.cardType === 'father'
      ? '500px'
      : props.cardType === 'main'
      ? '600px'
      : '800px'};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;
