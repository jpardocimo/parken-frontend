import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`



  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;

    @font-face {
      font-family: 'Roboto Slab';
      font-style: normal;
      font-weight: 400;
      src: url('../fonts/roboto-slab-v24-latin-regular.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/roboto-slab-v24-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-slab-v24-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-regular.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-slab-v24-latin-regular.svg#RobotoSlab') format('svg'); /* Legacy iOS */
    }

    @font-face {
      font-family: 'Roboto Slab';
      font-style: normal;
      font-weight: 500;
      src: url('../fonts/roboto-slab-v24-latin-500.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/roboto-slab-v24-latin-500.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-slab-v24-latin-500.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-500.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-500.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-slab-v24-latin-500.svg#RobotoSlab') format('svg'); /* Legacy iOS */
    }

    @font-face {
      font-family: 'Roboto Slab';
      font-style: normal;
      font-weight: 600;
      src: url('../fonts/roboto-slab-v24-latin-600.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/roboto-slab-v24-latin-600.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-slab-v24-latin-600.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-600.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-600.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-slab-v24-latin-600.svg#RobotoSlab') format('svg'); /* Legacy iOS */
    }

    @font-face {
      font-family: 'Roboto Slab';
      font-style: normal;
      font-weight: 700;
      src: url('../fonts/roboto-slab-v24-latin-700.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/roboto-slab-v24-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-slab-v24-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-700.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-slab-v24-latin-700.svg#RobotoSlab') format('svg'); /* Legacy iOS */
    }

    @font-face {
      font-family: 'Roboto Slab';
      font-style: normal;
      font-weight: 800;
      src: url('../fonts/roboto-slab-v24-latin-800.eot'); /* IE9 Compat Modes */
      src: local(''),
           url('../fonts/roboto-slab-v24-latin-800.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
           url('../fonts/roboto-slab-v24-latin-800.woff2') format('woff2'), /* Super Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-800.woff') format('woff'), /* Modern Browsers */
           url('../fonts/roboto-slab-v24-latin-800.ttf') format('truetype'), /* Safari, Android, iOS */
           url('../fonts/roboto-slab-v24-latin-800.svg#RobotoSlab') format('svg'); /* Legacy iOS */
    }

  }

  body {
    -webkit-font-smoothing: antialiased;
    height: 100vh;
  }

  #root {
    height: 100%;
  }

  body, input, textarea, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
    line-height: 1.5em;
  }

  textarea {
    font-size: 15px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
    margin-bottom: 15px;
  }

  h2 {
    margin-top: 30px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  // Reduce the width of matrix in the survey
  table.matrixSmallFont {
    table-layout: fixed;
    width: 100%;
  }

  .matrixSmallFont {
    font-size: 1rem;
  }

  .matrixSmallFont th {
    font-size: 14px;
    border-bottom-style: inset ;
    border-bottom-color: whitesmoke;
  }

  .matrixSmallFont tr td {
    width: auto;
    border-bottom-style: inset;
    border-bottom-color: whitesmoke;
  }

  .matrixSmallFont tr td:first-child {
    width: 400px;
  }

  .matrixSmallFont .sv-table__cell:not(:first-child) {
    padding-left: .2em;
  }

  .matrixSmallFont .sv-table__cell:not(:last-child) {
    padding-right: .2em;
  }
  // Reduce the width of matrix in the survey

  // End text of the survey js
  .sv-completedpage {
    padding-top: 54px;
    padding-bottom: 54px;
    height: auto;
    line-height: 1.3em;
  }

  .sv-completedpage:before {
    margin-bottom: 24px;
  }
  // End text of the survey js

  // Active menu item
  .active {
    background-color: rgba(255, 255, 255, .16);
    border-radius: 4px 0 0 4px;
  }
  // Active menu item

  .stop-scrolling {
    height: 100%;
    overflow: hidden;
  }

  // Tooltip with CSS
  div.callout {
    background-color: #444;
    position: absolute;
    color: #ccc;
    padding: 2px 8px;
    border-radius: 3px;
    box-shadow: 0 0 20px #999;
    text-shadow: 0 0 1px #000;
    font-size: 10px;
    display: none;
    top: -37px;
    left: -5px;
  }

  .callout::before {
    content: "";
    border: 0.8em solid transparent;
    position: absolute;
    left: 4px;
    bottom: -18px;
    border-top: 10px solid #444;
  }
  // Tooltip with CSS
`;
