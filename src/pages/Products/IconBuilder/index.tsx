import React from 'react';
import { Link } from 'react-router-dom';

import { FiPlusCircle, FiCheckCircle } from 'react-icons/fi';

import { Icon } from './styles';

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

interface Props {
  product: Product;
  userGroupName: string;
  isSurveyTemplateScreen?: boolean;
}

const IconBuilder: React.FC<Props> = ({
  product,
  userGroupName,
  isSurveyTemplateScreen = false,
}) => {
  const hasStructure = product.userGroups.find(
    userGroup =>
      userGroup.name === userGroupName &&
      userGroup.structure &&
      userGroup.structure.length > 0,
  );

  const subGroupsList = product.userGroups.flatMap(({ subGroups }) =>
    subGroups?.flatMap(x => ({ ...x })),
  );

  const hasTemplate = subGroupsList.find(
    subGroup => subGroup.name === userGroupName && subGroup.surveyId,
  );

  if (isSurveyTemplateScreen) {
    if (hasTemplate) {
      return (
        <Link to={`/surveys/${hasTemplate.surveyId}`}>
          <Icon type="button">
            <FiCheckCircle color={'#2DCC70'} size={27} />
          </Icon>
        </Link>
      );
    }

    return (
      <Link
        to={{
          pathname: `/products/templateDecision`,
          state: {
            product,
            selectedUserGroup: userGroupName,
          },
        }}
      >
        <Icon type="button">
          <FiPlusCircle color={'#000'} size={27} />
        </Icon>
      </Link>
    );
  }

  return (
    <Link
      to={{
        pathname: '/products/structure',
        state: { product, selectedUserGroup: userGroupName },
      }}
    >
      {hasStructure ? (
        <Icon type="button">
          <FiCheckCircle color={'#2DCC70'} size={27} />
        </Icon>
      ) : (
        <Icon type="button">
          <FiPlusCircle color={'#000'} size={27} />
        </Icon>
      )}
    </Link>
  );
};

export default IconBuilder;
