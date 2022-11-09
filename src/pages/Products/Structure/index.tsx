/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, useCallback, Children } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import {
  removeNodeAtPath,
  getFlatDataFromTree,
  getNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree';

import * as Yup from 'yup';

import {
  Container,
  SortableTreeStyled,
  SortableList,
  ContainerSortableTree,
  ContainerSortableList,
  ContainerStructure,
} from './styles';

import api from '../../../services/api';
import Button from '../../../components/Button';
import { useToast } from '../../../hooks/toast';
import EnumCategoryType from '../../../utils/enums/EnumCategoryType';

interface StateFromPreviousPage {
  product: Product;
  selectedUserGroup: string;
}

interface TreeData {
  title: string;
  isTwin: boolean;
  type: string;
  level: number;
  categoryId?: number;
  questionId?: number;
  children: Children[];
}

interface Children {
  title: string;
  isTwin: boolean;
  type?: string;
  level?: number;
  categoryId?: number;
  questionId?: number;
  children?: Children[];
}

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

interface Question {
  name?: string;
  title?: string;
  questionId?: number;
}

interface SubGroup {
  name?: string;
  surveyId?: number;
}

interface UserGroup {
  name?: string;
}

const CreateProduct: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const { state: stateFromPreviousPage } = useLocation<StateFromPreviousPage>();
  const [questions, setQuestions] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);

  const [treeQuestions, setTreeQuestions] = useState<any[]>([]);
  const [treeStructure, setTreeStructure] = useState<any>([]);
  const [treeCategories, setTreeCategories] = useState<any[]>([]);

  const [stringQueryQuestions, setStringQueryQuestions] = useState('');
  const [stringQueryCategories, setStringQueryCategories] = useState('');
  const [questionListDisabled, setQuestionListDisabled] = useState(false);

  const [searchParam] = useState(['title']);

  const externalNodeType = 'ebNodeType';

  const removeDuplicated = useCallback((data: TreeData[], key): TreeData[] => {
    return [
      ...new Map(data.map((item: TreeData) => [key(item), item])).values(),
    ];
  }, []);

  // disable question list if structure list is empty
  useEffect(() => {
    setQuestionListDisabled(treeStructure.length !== 0);
  }, [treeStructure.length]);

  // load structure from product's page by state
  useEffect(() => {
    const structureFromUserGroup = stateFromPreviousPage.product?.userGroups
      .filter(ug => ug.name === stateFromPreviousPage.selectedUserGroup)
      .map(item => item.structure)[0];

    if (structureFromUserGroup && structureFromUserGroup?.length > 0) {
      const structure =
        structureFromUserGroup &&
        structureFromUserGroup!.map((aPillar: any) => {
          return {
            title: aPillar.name,
            type: aPillar.category,
            categoryId: aPillar.categoryId,
            children:
              aPillar.topics &&
              aPillar.topics.map((topic: any) => {
                return {
                  title: topic.name,
                  type: topic.category,
                  categoryId: topic.categoryId,
                  children:
                    topic &&
                    topic.topics?.map((subTopic: any) => {
                      return {
                        title: subTopic.name,
                        type: subTopic.category,
                        categoryId: subTopic.categoryId,
                        questionId: subTopic.questionId,
                        children:
                          subTopic &&
                          subTopic.topics?.map((question: any) => {
                            return {
                              questionId: question.questionId,
                              title: `${question.name}`,
                              type: question.category,
                            };
                          }),
                      };
                    }),
                };
              }),
          };
        });

      toggleExpandedForAll(structure);
      setTreeStructure(structure);
    }
  }, [
    stateFromPreviousPage.product?.userGroups,
    stateFromPreviousPage.selectedUserGroup,
  ]);

  // load question list
  useEffect(() => {
    const { selectedUserGroup } = stateFromPreviousPage;

    const surveyIdsFromUserGroup: string =
      stateFromPreviousPage.product.userGroups
        .filter((u: UserGroup) => u.name === selectedUserGroup)
        .flatMap(({ subGroups }: UserGroup) =>
          subGroups
            .filter((sub: SubGroup) => sub.surveyId)
            .flatMap((x: SubGroup) => x.surveyId),
        )
        .toString();

    api
      .get(`/surveys/list/${surveyIdsFromUserGroup.toString()}`)
      .then(result => {
        const questionsList: TreeData[] = result.data.flatMap(
          ({ pages }: any) =>
            pages.flatMap(({ elements }: any) =>
              elements
                .filter((q: Question) => q.questionId)
                .flatMap((q: Question) => {
                  return {
                    title: `${q.name}`,
                    questionId: q.questionId,
                    type: EnumCategoryType.Question,
                  };
                }),
            ),
        );

        const questionsFromMatrix: TreeData[] = result.data.flatMap(
          ({ pages }: any) =>
            pages.flatMap(({ elements }: any) =>
              elements.flatMap(({ rows }: any) =>
                rows
                  ?.filter((q: any) => q.questionId && q !== undefined)
                  .flatMap((q: any) => {
                    return {
                      title: `${q.text}`,
                      questionId: q.questionId,
                      type: EnumCategoryType.Question,
                    };
                  }),
              ),
            ),
        );

        const questionsFullList = [
          ...questionsList,
          ...questionsFromMatrix.filter(item => item !== undefined),
        ];

        const uniqueQuestions = removeDuplicated(
          questionsFullList,
          (q: TreeData) => q.title,
        );

        // We can improve this, creating a method returning flat list of questions
        const structureApillar = treeStructure.filter(
          (item: any) => item !== undefined,
        );

        // extract flat list  categories from all Topics
        const structureTopic = structureApillar
          .flatMap(({ children }: any) => children)
          .filter((item: any) => item !== undefined);

        // extract flat list categories from all SubTopics
        const structreQuestionsTopic = structureTopic
          .flatMap(({ children }: any) => children)
          .filter(
            (item: any) =>
              item !== undefined && item.type === EnumCategoryType.Question,
          );

        const structreSubTopics = structureTopic
          .flatMap(({ children }: any) => children)
          .filter(
            (item: any) =>
              item !== undefined && item.type === EnumCategoryType.Subtopic,
          );

        const structreQuestionsSubTopic = structreSubTopics
          .flatMap(({ children }: any) => children)
          .filter(
            (item: any) =>
              item !== undefined && item.type === EnumCategoryType.Question,
          );

        // We can improve this, creating a method returning flat list of questions
        const questionFromStructureFlat = [
          ...structreQuestionsTopic,
          ...structreQuestionsSubTopic,
        ];

        const categoryListRemaining = uniqueQuestions
          .filter((question: any) => {
            return !questionFromStructureFlat.some((item: any) => {
              // eslint-disable-next-line eqeqeq
              return item.questionId == question.questionId;
            });
          })
          .filter((item: any) => item !== undefined);

        setTreeQuestions(categoryListRemaining);
        setQuestions(categoryListRemaining);
      });
  }, [removeDuplicated, stateFromPreviousPage, treeStructure]);

  // categories
  useEffect(() => {
    let categoryList: any = [];

    api.get(`categories`).then(response => {
      // get all categories from database, but remove those already added to structure

      if (treeStructure.length > 0) {
        // We can improve this, creating a method returning flat list of questions

        // extract flat list  categories from all A-Pillars
        const structureApillar = treeStructure.filter(
          (item: any) => item !== undefined,
        );

        // extract flat list  categories from all Topics
        const structureTopic = structureApillar
          .flatMap(({ children }: any) => children)
          .filter((item: any) => item !== undefined);

        // extract flat list categories from all SubTopics
        const structureSubTopic = structureTopic
          .flatMap(({ children }: any) => children)
          .filter(
            (item: any) =>
              item !== undefined && item.type === EnumCategoryType.Subtopic,
          );

        // We can improve this, creating a method returning flat list of questions
        // flat list with all categories from structure
        const categoryStructureFlat = [
          ...structureApillar,
          ...structureTopic,
          ...structureSubTopic,
        ];

        // get categories that haven't been added to the structure yet
        const categoryListRemaining = response.data
          .filter((category: any) => {
            return !categoryStructureFlat.some((item: any) => {
              return item.categoryId === category.categoryId;
            });
          })
          .filter((item: any) => item !== undefined);

        categoryList = [...categoryListRemaining];
      } else {
        categoryList = response.data;
      }

      setCategories(categoryList);
      setTreeCategories(categoryList);
    });
  }, [treeStructure]);

  // after moving, need remove duplicated questions from question's tree list
  useEffect(() => {
    const uniqueQuestions: any[] = removeDuplicated(
      questions,
      (q: TreeData) => q.title,
    ).map((q: TreeData) => {
      return {
        title: q.title,
        // isTwin: q.isTwin,
        type: q.type,
        level: '',
        questionId: q.questionId,
        children: [],
      };
    });
    setTreeQuestions(uniqueQuestions);
  }, [questions, removeDuplicated]);

  // rules for drop questions and categories into structure tree
  const canDrop = useCallback((item: any, grid?: string): boolean => {
    if (
      item.nextParent === null &&
      item.nextPath.length === 1 &&
      item.nextPath[0] === 0 &&
      item.node.type === EnumCategoryType.Question &&
      grid === 'main'
    ) {
      return false;
    }

    // RULE: can't drop a question into 1st and 2nd levels
    if (
      (item.nextPath.length === 1 || item.nextPath.length === 2) &&
      item.node.type === EnumCategoryType.Question &&
      grid === 'main'
    ) {
      return false;
    }

    // RULE: Question can't have children
    if (item.nextParent?.type === EnumCategoryType.Question) {
      return false;
    }

    // RULE: Questions can't have categories as siblings - When the user try to drop a Question
    const nextParentHasNotOnlyQuestions = item.nextParent?.children.some(
      (c: any) => c.type !== EnumCategoryType.Question,
    );

    if (
      nextParentHasNotOnlyQuestions &&
      item.node.type === EnumCategoryType.Question
    ) {
      return false;
    }

    // RULE: Categories and questions can't be siblings - When the user try to drop a Categorie
    const nextParentHasQuestions = item.nextParent?.children.some(
      (c: any) => c.type === EnumCategoryType.Question,
    );

    if (
      nextParentHasQuestions &&
      item.node.type !== EnumCategoryType.Question
    ) {
      return false;
    }

    // RULE: Topic that has questions as children can't be dropped at A-Pillar's level
    if (
      item.nextPath.length === 1 &&
      item.node?.children?.some(
        (c: any) => c.type === EnumCategoryType.Question,
      )
    ) {
      return false;
    }

    // Categories can't be dropped into 4th level
    if (
      item.nextPath.length === 4 &&
      item.node.type !== EnumCategoryType.Question
    ) {
      return false;
    }

    return true;
  }, []);

  const search = useCallback(
    (items: any[], searchType) => {
      const stringQuery =
        searchType === 'questions'
          ? stringQueryQuestions
          : stringQueryCategories;
      return items?.filter((item: any) => {
        return searchParam?.some(newItem => {
          return (
            item &&
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(stringQuery.toLowerCase()) > -1
          );
        });
      });
    },
    [searchParam, stringQueryCategories, stringQueryQuestions],
  );

  const setValueAfterMoving = useCallback(
    (movingType: string) => {
      const arrayToFilter = movingType === 'questions' ? questions : categories;
      const flatData = getFlatDataFromTree({
        treeData: treeStructure,
        getNodeKey: ({ node }: any) => node.id,
        ignoreCollapsed: false,
      }).map(({ node, path, getNodeKey }: any) => ({
        title: node.title,
        questionId: node.id,
        parent: path.length > 1 ? path[path.length - 2] : null,

        children: `${getNodeAtPath({
          treeData: treeStructure,
          path: [1],
          questionId: node.id,
          getNodeKey,
        })}`,
      }));

      return arrayToFilter.filter((c: TreeData) => {
        return !flatData!.some((x: TreeData) => {
          return x?.title === c?.title;
        });
      });
    },
    [categories, questions, treeStructure],
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getNodeKey = ({ treeIndex }: any) => treeIndex;

  // change type (A-pillar, topic, subtopic) acoording level and set removeButton for each node
  const createNewProps = useCallback(
    (node, path) => {
      // remove button and set type

      let listCategories: any = [];
      let listQuestions: any = [];

      // remove button
      const buttons = [
        <button
          key=""
          onClick={() => {
            const nodeWithoutChildren = {
              _id: node._id,
              categoryId: node.categoryId,
              questionId: node.questionId,
              title: node.title,
              type: node.type,
            };

            // check if node has children and child type to remove and put it back to original list
            if (node.children?.length > 0) {
              switch (node.type) {
                case EnumCategoryType.Apillar: {
                  // remove A-pillar node and get its children to remove

                  // get all Topic from A-pillar to remove
                  const listTopics = node.children.flatMap((c: any) => ({
                    ...c,
                  }));

                  // get all subtopics from Topic of A-pillar to remove
                  const listSubtopics = listTopics
                    .flatMap(({ children }: any) => children)
                    ?.filter(
                      (i: any) =>
                        i !== undefined && i.type !== EnumCategoryType.Question,
                    );

                  // get all questions from Topic of A-pillar to remove
                  const listQuestionsOfTopic = listTopics
                    .flatMap(({ children }: any) => children)
                    ?.filter(
                      (i: any) =>
                        i !== undefined && i.type === EnumCategoryType.Question,
                    );

                  // get all questions from SubTopic of A-pillar to remove
                  const listQuestionsOfSubtopic = listSubtopics
                    .flatMap(({ children }: any) => children)
                    ?.filter((i: any) => i !== undefined);

                  const listTopicsWithoutChildren = listTopics.map(
                    (obj: any) => {
                      return {
                        _id: obj._id,
                        categoryId: obj.categoryId,
                        questionId: obj.questionId,
                        title: obj.title,
                        type: obj.type,
                      };
                    },
                  );

                  const listSubTopicsWithoutChildren = listSubtopics.map(
                    (obj: any) => {
                      return {
                        _id: obj._id,
                        categoryId: obj.categoryId,
                        questionId: obj.questionId,
                        title: obj.title,
                        type: obj.type,
                      };
                    },
                  );

                  listCategories = [
                    nodeWithoutChildren,
                    ...listTopicsWithoutChildren,
                    ...listSubTopicsWithoutChildren,
                  ];

                  listQuestions = [
                    ...listQuestionsOfTopic,
                    ...listQuestionsOfSubtopic,
                  ];
                  break;
                }
                case EnumCategoryType.Topic: {
                  // remove A-pillar node and get its children to remove

                  // get all SubTopics from Topic to remove
                  const listSubtopics = node.children
                    .flatMap((c: any) => ({ ...c }))
                    .filter(
                      (i: any) =>
                        i !== undefined && i.type !== EnumCategoryType.Question,
                    );

                  const listQuestionsOfTopic = node.children
                    .flatMap((c: any) => ({
                      ...c,
                    }))
                    ?.filter(
                      (i: any) =>
                        i !== undefined && i.type === EnumCategoryType.Question,
                    );

                  const listQuestionsOfSubtopic = listSubtopics
                    .flatMap(({ children }: any) => children)
                    ?.filter((i: any) => i !== undefined);

                  const listSubTopicsWithoutChildren = listSubtopics.map(
                    (obj: any) => {
                      return {
                        _id: obj._id,
                        categoryId: obj.categoryId,
                        questionId: obj.questionId,
                        title: obj.title,
                        type: obj.type,
                      };
                    },
                  );

                  listCategories = [
                    nodeWithoutChildren,
                    ...listSubTopicsWithoutChildren,
                  ];

                  listQuestions = [
                    ...listQuestionsOfTopic,
                    ...listQuestionsOfSubtopic,
                  ];

                  break;
                }
                case EnumCategoryType.Subtopic: {
                  const listQuestionsOfSubtopic = node.children
                    .flatMap((c: any) => ({ ...c }))
                    .filter(
                      (i: any) =>
                        i !== undefined && i.type === EnumCategoryType.Question,
                    );

                  listCategories = [nodeWithoutChildren];

                  listQuestions = [...listQuestionsOfSubtopic];
                  break;
                }
                default: {
                  break;
                }
              }
            }

            if (
              (!node.children || node.children?.length === 0) &&
              node.type === EnumCategoryType.Question
            ) {
              listQuestions.push(nodeWithoutChildren);
            } else if (
              (!node.children || node.children?.length === 0) &&
              node.type !== EnumCategoryType.Question
            ) {
              listCategories.push(nodeWithoutChildren);
            }

            const treeCategoriesLocal = treeCategories;
            treeCategoriesLocal.push(...listCategories);
            setTreeCategories(treeCategoriesLocal);

            const treeQuestionsLocal = treeQuestions;
            treeQuestionsLocal.push(...listQuestions);
            setTreeQuestions(treeQuestionsLocal);

            setTreeStructure(
              removeNodeAtPath({
                treeData: treeStructure,
                path,
                getNodeKey,
              }),
            );
          }}
        >
          <FiXCircle />
        </button>,
      ];

      if (node.type === EnumCategoryType.Question) {
        return {
          ...node,
          questionId: node.questionId,
          title: `${EnumCategoryType.Question}: ${node.title}`,
          buttons,
        };
      }

      // add properties to strucutre item
      switch (path.length) {
        case 1: {
          node.type = EnumCategoryType.Apillar; // eslint-disable-line no-param-reassign
          return {
            buttons,
            categoryId: node.categoryId,
            title: `${EnumCategoryType.Apillar}: ${node.title}`,
            type: EnumCategoryType.Apillar,
            path,
          };
        }
        case 2: {
          node.type = EnumCategoryType.Topic; // eslint-disable-line no-param-reassign
          return {
            buttons,
            categoryId: node.categoryId,
            title: `${EnumCategoryType.Topic}: ${node.title}`,
            type: EnumCategoryType.Topic,
            path,
          };
        }
        case 3: {
          node.type = EnumCategoryType.Subtopic; // eslint-disable-line no-param-reassign
          return {
            buttons,
            categoryId: node.categoryId,
            title: `${EnumCategoryType.Subtopic}: ${node.title}`,
            type: EnumCategoryType.Subtopic,
            path,
          };
        }
        default: {
          return node;
        }
      }
    },
    [treeCategories, treeQuestions, treeStructure],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const structure =
        treeStructure &&
        treeStructure.map((aPillar: TreeData) => {
          return {
            name: aPillar.title,
            category: aPillar.type,
            categoryId: aPillar.categoryId,
            topics:
              aPillar.children &&
              aPillar.children.map(topic => {
                return {
                  name: topic.title,
                  category: topic.type,
                  categoryId: topic.categoryId,
                  topics:
                    topic &&
                    topic.children?.map((subTopic: any) => {
                      return {
                        name: subTopic.title,
                        category: subTopic.type,
                        questionId: parseInt(subTopic.questionId, 10),
                        categoryId: subTopic.categoryId,
                        topics:
                          subTopic &&
                          subTopic.children?.map((question: any) => {
                            return {
                              questionId: parseInt(question.questionId, 10),
                              name: question.title,
                              category: question.type,
                            };
                          }),
                      };
                    }),
                };
              }),
          };
        });

      const arrayToPost = {
        nameUserGroup: stateFromPreviousPage.selectedUserGroup,
        productId: stateFromPreviousPage.product.productId,
        structure,
      };

      await api.post('/products/structure', arrayToPost);
      history.push('/products');

      addToast({
        type: 'success',
        title: 'Success',
        description: 'The product structure was configurated successfully!',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return;
      }

      addToast({
        type: 'error',
        title: 'Registration Error',
        description:
          'An error occurred while configurating product, please try again.',
      });
    }
  }, [
    addToast,
    history,
    stateFromPreviousPage.product.productId,
    stateFromPreviousPage.selectedUserGroup,
    treeStructure,
  ]);

  return (
    <Container>
      <h1>{stateFromPreviousPage.product?.name}</h1>
      <span>Setup the structure here...</span>
      <ContainerSortableTree>
        <SortableTreeStyled
          style={{ height: 410 }}
          canDrop={(e: any) => canDrop(e, 'main')}
          treeData={treeStructure}
          maxDepth={4}
          rowHeight={55}
          onChange={(treeData: any) => setTreeStructure(treeData)}
          dndType={externalNodeType}
          shouldCopyOnOutsideDrop={false}
          generateNodeProps={({ node, path }: any) =>
            createNewProps(node, path)
          }
        />
      </ContainerSortableTree>

      <ContainerStructure>
        <ContainerSortableList>
          <h4>Categories</h4>
          <input
            name={'inputSearchCategories'}
            placeholder={'search...'}
            onChange={event => setStringQueryCategories(event.target.value)}
          />

          <SortableList
            treeData={search(treeCategories, 'categories')}
            dndType={externalNodeType}
            onChange={() =>
              setTreeCategories(setValueAfterMoving('categories'))
            }
            shouldCopyOnOutsideDrop={false}
            canDrop={canDrop}
          />
        </ContainerSortableList>

        <ContainerSortableList>
          <h4>
            Questions{' '}
            {!questionListDisabled &&
              '(Set "A-Pillar" and "Topic" to enable Drag & Drop Questions)'}
          </h4>
          <input
            name={'inputSearchQuestions'}
            placeholder={'search...'}
            onChange={event => setStringQueryQuestions(event.target.value)}
          />
          <SortableList
            canDrag={questionListDisabled}
            treeData={search(treeQuestions, 'questions')}
            dndType={externalNodeType}
            onChange={() => setTreeQuestions(setValueAfterMoving('questions'))}
            shouldCopyOnOutsideDrop={false}
            canDrop={canDrop}
          />
        </ContainerSortableList>
      </ContainerStructure>

      <Button
        type="submit"
        width="200px"
        height="50px"
        marginRight="30px"
        onClick={() => handleSubmit()}
      >
        Save Structure
      </Button>
    </Container>
  );
};

export default CreateProduct;
