/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';

import {
  TreeDataState,
  IntegratedFiltering,
  CustomTreeData,
  SortingState,
  SelectionState,
  FilteringState,
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
  IntegratedSelection,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableTreeColumn,
  PagingPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import { ActionColumns, IActionColumn } from './ActionsColumn';
import { useToast } from '../../hooks/toast';

interface TableProps {
  columnsProp: any[];
  dataProp: any[];
  selectionProp?: any;
  multiSelection?: boolean;
  checkboxSelection: boolean;
  setSelectedRowId?: any;
  height?: string;
  tableColumnExtensions?: any[];
  integratedFilteringColumnExtensions?: any;
  actionColumns?: IActionColumn[];
  hasFilterRow?: boolean;
  idName?: string;
}

const DevExpressTable: React.FC<TableProps> = ({
  columnsProp,
  dataProp,
  selectionProp,
  multiSelection,
  checkboxSelection,
  setSelectedRowId,
  tableColumnExtensions,
  integratedFilteringColumnExtensions,
  actionColumns,
  hasFilterRow,
  idName,
}) => {
  const { addToast } = useToast();
  const [pageSizes] = React.useState<number[]>([5, 10, 15, 50, 100]);
  const [selection, setSelection] = useState<any>([]);
  const [filters, setFilters] = useState([{ columnName: '', value: '' }]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const getChildRows = useCallback((row, rootRows) => {
    return row ? row.alternatives : rootRows;
  }, []);

  const idInternalName = idName ?? '';

  const getRowId = (row: any) => {
    return row[`${idInternalName}`]?.toString() ?? 'id';
  };

  // set initial selection from survey
  useEffect(() => {
    const unique = selectionProp?.filter(
      (elem: any, index: number, self: any) => {
        return index === self.indexOf(elem);
      },
    );
    setSelection(unique && unique?.map(String));
  }, [selectionProp]);

  const onChangeFilterCustom = useCallback(
    (e: any) => {
      setFilters(e);

      const filter = e.filter((item: any) => item.columnName === 'externalId');

      let filteredArray = [];

      if (
        filter[0]?.columnName === 'externalId' &&
        filter[0]?.value.includes('.')
      ) {
        filteredArray = dataProp.flatMap(q =>
          q.alternatives.filter((a: any) =>
            a.externalId.toString().startsWith(filter[0]?.value),
          ),
        );
      }

      const filterId = e.filter((item: any) => item.columnName == 'questionId');

      if (
        filterId[0]?.columnName == 'questionId' &&
        filterId[0]?.value.includes('.')
      ) {
        filteredArray = dataProp.flatMap(q =>
          q.alternatives.filter((a: any) =>
            a.questionId?.toString()?.startsWith(filterId[0]?.value),
          ),
        );
      }

      setFilteredData(filteredArray);
    },
    [dataProp],
  );

  const setSelectionCustom = useCallback(
    e => {
      const newSelectionArray = e.map(String);

      if (multiSelection) {
        const arrayNumbers = newSelectionArray.map(Number);

        for (let i = 0; i < arrayNumbers.length - 1; i += 1) {
          const elementI = arrayNumbers[i];

          for (let j = i + 1; j < arrayNumbers.length; j += 1) {
            const elementJ = arrayNumbers[j];
            if (parseInt(elementI, 10) === parseInt(elementJ, 10)) {
              addToast({
                type: 'info',
                title: 'Cannot Select!',
                description: `The item ${elementI} is already selected and has the same main Id for the item: ${elementJ}. Please remove the item ${elementI} first.`,
              });
              return;
            }
          }
        }

        setSelection(newSelectionArray);
        setSelectedRowId(newSelectionArray);
      } else {
        setSelection([newSelectionArray[newSelectionArray.length - 1]]);
        setSelectedRowId([newSelectionArray[newSelectionArray.length - 1]]);
      }
    },
    [addToast, multiSelection, setSelectedRowId],
  );

  return (
    <Paper>
      <Grid
        rows={filteredData && filteredData.length > 0 ? filteredData : dataProp}
        columns={columnsProp}
        getRowId={getRowId}
      >
        <TreeDataState />
        {hasFilterRow && (
          <FilteringState
            columnExtensions={tableColumnExtensions}
            filters={filters}
            onFiltersChange={(e: any) => onChangeFilterCustom(e)}
          />
        )}
        <SortingState />
        {checkboxSelection && (
          <SelectionState
            selection={selection}
            onSelectionChange={(e: any) => setSelectionCustom(e)}
          />
        )}

        <PagingState defaultCurrentPage={0} defaultPageSize={pageSizes[4]} />
        {hasFilterRow && (
          <IntegratedFiltering
            columnExtensions={integratedFilteringColumnExtensions}
          />
        )}
        <CustomTreeData getChildRows={getChildRows} />
        <IntegratedSorting />
        <IntegratedPaging />
        {checkboxSelection && <IntegratedSelection />}

        <Table columnExtensions={tableColumnExtensions} />
        {checkboxSelection && <TableSelection showSelectAll={false} />}
        <TableHeaderRow showSortingControls />
        {hasFilterRow && <TableFilterRow />}
        <TableTreeColumn for="text" />

        <PagingPanel pageSizes={pageSizes} />

        {actionColumns && <ActionColumns actionColumns={actionColumns} />}
      </Grid>
    </Paper>
  );
};
export default DevExpressTable;
