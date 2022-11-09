import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import IconBuilder from './IconBuilder';

import {
  Container,
  Content,
  Button,
  BoxRow,
  BoxCol,
  BoxColTitle,
} from './styles';

interface Product {
  productId: number;
  name: string;
  userGroups: UserGroup[];
}

interface UserGroup {
  name?: string;
  subGroups: SubGroup[];
  structure?: object[];
}

interface SubGroup {
  name: string;
  surveyId?: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('products').then(response => {
      setProducts(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Structures</h1>

      <Link to="/products/new">
        <Button variant="contained" type="button">
          New Product
        </Button>
      </Link>

      <Content>
        <BoxRow>
          <BoxCol>Existing Products</BoxCol>
          <BoxCol>Internal</BoxCol>
          <BoxCol>External</BoxCol>
        </BoxRow>

        {products.map(product => (
          <BoxRow key={product.productId}>
            <BoxColTitle>{product.name}</BoxColTitle>
            <BoxCol>
              <IconBuilder product={product} userGroupName="Internal" />
            </BoxCol>
            <BoxCol>
              <IconBuilder product={product} userGroupName="External" />
            </BoxCol>
          </BoxRow>
        ))}
      </Content>
    </Container>
  );
};

export default Products;
