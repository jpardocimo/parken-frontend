import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../../../services/api';

import IconBuilder from '../IconBuilder';

import EnumProductSubGroup from '../../../utils/enums/EnumProductSubGroup';

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

const SurveyTemplate: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('products').then(response => {
      setProducts(response.data);
    });
  }, []);

  return (
    <Container>
      <h1>Survey Templates</h1>

      <Link to="/products/new">
        <Button variant="contained" type="button">
          New Product
        </Button>
      </Link>

      <Content>
        <BoxRow>
          <BoxCol>Existing Products</BoxCol>
          <BoxCol>{EnumProductSubGroup.Employees}</BoxCol>
          <BoxCol>{EnumProductSubGroup.Management}</BoxCol>
          <BoxCol>{EnumProductSubGroup.Corporate}</BoxCol>
          <BoxCol>{EnumProductSubGroup.Retail}</BoxCol>
          <BoxCol>{EnumProductSubGroup.Wealthy}</BoxCol>
        </BoxRow>

        {products.map(product => (
          <BoxRow key={product.productId}>
            <BoxColTitle>{product.name}</BoxColTitle>
            {Object.keys(EnumProductSubGroup).map(key => (
              <BoxCol key={key}>
                <IconBuilder
                  product={product}
                  userGroupName={key}
                  isSurveyTemplateScreen
                />
              </BoxCol>
            ))}
          </BoxRow>
        ))}
      </Content>
    </Container>
  );
};

export default SurveyTemplate;
