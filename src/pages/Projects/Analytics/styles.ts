import styled from 'styled-components';

export const DashboardContainer = styled.div`
  box-sizing: border-box;
  background-color: #f9f9f9;
  border: none;
  padding: 0px;
  position: relative;
  top: 20px;
  float: left;
  border-left: 0;
  border-top: 0;
  border: 1px solid #c8c8c8;

  margin-top: 0px;
`;

export const DashboardHeader = styled.div`
  box-shadow: 0 3px 8px rgb(112 120 135 / 24%);

  width: 100%;
  height: 56px;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 500;
  padding: 0 24px;
`;

export const HeaderTitle = styled.div`
  p {
    font-size: 24px;
    margin-bottom: 0 !important;
    margin-top: 14px !important;
    /* 8px !important; */
    line-height: 28px !important;
  }

  cursor: default;
  float: left;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-weight: 500;
  min-width: 0;
  max-width: 1056px;
  width: auto;
  margin-left: 0;
`;

export const DashBoardChartsContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`;

export const DashboardFilterContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const DashboardChartBox = styled.div`
  box-shadow: rgba(112, 120, 135, 0.24) 0 3px 8px,
    rgba(112, 120, 135, 0.493) 0px 3px 6px;
  width: 98%;
  margin: 10px;
  padding: 37px;
  border-radius: 4px;
  background: #ffffff;
`;

export const DashoboardFilterBox = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 0px;
  width: 100%;

  box-shadow: rgba(112, 120, 135, 0.24) 0 3px 8px,
    rgba(112, 120, 135, 0.493) 0px 3px 6px;

  margin: 10px;
  padding: 15px;
  border-radius: 4px;
  background: #ffffff;

  p {
    padding-bottom: 10px;
  }
`;

export const ContainerEmpty = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 200px;
`;

export const Container = styled.div``;

export const Content = styled.div``;
