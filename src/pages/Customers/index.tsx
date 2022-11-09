import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { EditOutlined } from '@material-ui/icons';
import Table from '../../components/DevExpressTable/DevExpressTable';
import { columns } from './columns';
import { Container, Content, Button } from './styles';
import api from '../../services/api';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';

interface Customer {
  customerId: number;
  name: string;
  employee: DropDownObject;
  sector: DropDownObject;
  revenue: DropDownObject;
  country: DropDownObject;
  asset: DropDownObject;
  countProjects: number;
}

interface DropDownObject {
  value: number;
  label: string;
}

const Customers: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'customerId', width: 200 },
    { columnName: 'name', width: 1200 },
  ]);

  const handleClickEdit = useCallback(
    (row: any) => {
      history.push(`/customers/edit/${row.customerId}`);
    },
    [history],
  );

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'edit',
      label: 'Edit',
      onClick: handleClickEdit,
      icon: <EditOutlined />,
    },
  ]);

  useEffect(() => {
    setLoading(true);
    api.get('customers').then(response => {
      setCustomers(response.data);
    });
    setLoading(false);
  }, []);

  return (
    <Container className={loading ? 'loading' : ''}>
      <h1>Customers</h1>

      <Link to="/customers/new">
        <Button variant="contained" type="button">
          New Customer
        </Button>
      </Link>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={customers}
          checkboxSelection={false}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'customerId'}
        ></Table>
      </Content>
    </Container>
  );
};
export default Customers;
