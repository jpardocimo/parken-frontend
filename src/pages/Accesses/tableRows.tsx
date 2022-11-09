import React from 'react';

import { DeleteOutline } from '@material-ui/icons';

interface Props {
  rowsData: any;
  deleteTableRows: any;
  handleChange: any;
}

const TableRows: React.FC<Props> = ({
  rowsData,
  deleteTableRows,
  handleChange,
}) => {
  return rowsData.map((data: any, index: any) => {
    const { searchValue, replaceValue } = data;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={searchValue}
            onChange={evnt => handleChange(index, evnt)}
            name="searchValue"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={replaceValue}
            onChange={evnt => handleChange(index, evnt)}
            name="replaceValue"
            className="form-control"
          />{' '}
        </td>

        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteTableRows(index)}
            type="button"
          >
            <DeleteOutline></DeleteOutline>
          </button>
        </td>
      </tr>
    );
  });
};
export default TableRows;
