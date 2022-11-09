import styled from 'styled-components';
import '@nosferatu500/react-sortable-tree/style.css';
import SortableTree from '@nosferatu500/react-sortable-tree';

export const Container = styled.div`
  height: 100%;
`;

export const ContainerStructure = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 5px 5px 5px 5px;
  margin: 5px;

  font-size: 0.9em;
  h2 {
    margin-top: 10px;
  }
`;

export const ContainerSortableTree = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 400px;
  padding: 5px 5px 20px 5px;
  margin: 5px;
  font-size: 1em;
  h2 {
    margin-top: 10px;
  }
  box-shadow: inset 0.01em 0 0.02em gray, 2px 0 0.2em gray;
`;

export const ContainerSortableList = styled.div`
  flex: 1;
  padding: 5px 10px 85px 10px;
  margin: 5px;
  height: 315px !important;

  margin: 5px;
  box-shadow: inset 0.01em 0 0.02em gray, 2px 0 0.2em gray;
  input {
    margin-bottom: 15px;
    width: 480px;
    padding: 3px;
  }
`;

export const SortableTreeStyled = styled(SortableTree)`
  .ReactVirtualized__Grid .ReactVirtualized__List .rst__virtualScrollOverride {
    direction: ltr;
    flex: 1 !important;
    padding: 10px 0 5px 5px;
    height: 300px !important;
    box-shadow: inset 0.03em 0 0.02em gray, 2px 0 0.2em gray;
    border-radius: 5px;

    will-change: transform;
    div {
      height: 100% !important;
      width: 100% !important;
    }
  }
  .rst__rowTitle {
    font-weight: normal !important;
    font-size: 80%;
  }

  .rst__placeholder,
  .rst__placeholder > * {
    box-sizing: border-box;
  }

  .rst__placeholder {
    position: relative;
    height: 68px;
    max-width: 300px;
    padding: 10px;
  }

  .rst__placeholder::before {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    padding: 3px;
    left: 5px;
    content-visibility: visible !important;
    content: 'Set 2 levels of categories at least to enable drag & drop questions.' !important;
    color: gray;
    font-size: small;
    z-index: 0;
  }
  .rstcustom__nodeContent {
    position: absolute;
    top: 0;
    bottom: 0;
    width: auto;
  }
`;

export const SortableList = styled(SortableTree)`
  .rst__rowTitle {
    font-size: 0.88em;
    font-weight: normal;
  }

  .rst__lineFullVertical::after,
  .rst__lineHalfVerticalTop::after,
  .rst__lineHalfVerticalBottom::after {
    width: 0;
    top: 0;
  }

  .rst__lineHalfHorizontalRight::before,
  .rst__lineFullVertical::after,
  .rst__lineHalfVerticalTop::after,
  .rst__lineHalfVerticalBottom::after {
    position: absolute;
    content: '';
    background-color: transparent;
  }
`;
