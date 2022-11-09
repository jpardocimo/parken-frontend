import styled from 'styled-components';

// export const Container = styled.div`
//   display: inline-block;
//   color: #aaa;
//   font-size: 12px;

//   h2 {
//     font-weight: bold;
//   }

//   p {
//     margin: 10px 0;
//   }
// `;

export const Container = styled.div`
  display: inline-block;
  color: black;
  font-size: 12px;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 24px 24px;
  position: relative;
  top: 40px;
  h2 {
    font-weight: bold;
  }

  p {
    margin: 10px 0;
  }
`;

export const Header = styled.header`
  width: 100%;
  height: 75px;
  background-color: #f08827;
  background-color: #e0e0e0;
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
