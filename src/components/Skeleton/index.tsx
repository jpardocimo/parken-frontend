import React, { useState, useRef, useCallback, useEffect } from 'react';

import { useToast } from '../../hooks/toast';

import api from '../../services/api';
import getDefaultQuestionType from '../../utils/getDefaultQuestionType';
import Button from '../Button';

import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  toggleExpandedForAll,
} from '../SortableTree/SortableTreeWithoutContext';
import SelectorButtonElement from './SelectorButtonElement';
import { BoxRadioButtons } from './styles';

export interface SortTreeProps {
  surveyId: number | undefined;
  treeDataParam: any;
  setSkeleton: any;
  handleGenerateSurvey: any;
  surveyIslocked: boolean;
}

const SortTree: React.FC<SortTreeProps> = props => {
  const [searchString, setSearchString] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [matrixTitle, setMatrixTitle] = useState('Matrix');
  const [imageURL, setImageURL] = useState('');
  const [htmlText, setHtmlText] =
    useState(`<p style="font-size: 20px; font-family: Raleway; font-weight: 700">
  Hier der gewünschte Text
  </p>`);
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);
  const [treeData, setTreeData] = useState<any>(props.treeDataParam);
  const [radioValue, setRadio] = useState('question');
  const [dataChanged, setDataChanged] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setDataChanged(false);
    localStorage.setItem(
      '@Victor:treeData',
      JSON.stringify(props.treeDataParam),
    );
    localStorage.setItem('@Victor:dataChanged', JSON.stringify(false));
  }, [props.treeDataParam]);

  useEffect(() => {
    const unloadCallback = (event: any): any => {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
      return '';
    };
    if (dataChanged) {
      window.addEventListener('beforeunload', unloadCallback);
      return () => window.removeEventListener('beforeunload', unloadCallback);
    }
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [dataChanged]);

  const getNodeKey = ({ treeIndex }: any): any => treeIndex;

  function checkNameNode(
    nameNode: string,
    typeNode: string,
    count: number,
  ): string {
    let flag = false;
    treeData.forEach((page: any) => {
      page.children.forEach((element: any) => {
        if (element.type === typeNode) {
          if (element.name === `${nameNode}_${count}`) {
            flag = true;
          }
        }
      });
    });
    if (flag) {
      return checkNameNode(`${nameNode}`, typeNode, count + 1);
    }
    return `${nameNode}_${count}`;
  }

  const checkArrayEqualsIgnoreOrder = useCallback((a: any, b: any) => {
    if (a?.length !== b?.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    // eslint-disable-next-line consistent-return
    let result = false;
    uniqueValues.forEach((v: any) => {
      const aCount = a.filter((e: any) => e.text === v.text).length;
      const bCount = b.filter((e: any) => e.text === v.text).length;

      if (aCount !== bCount) {
        result = false;
        return;
      }

      result = true;
    });

    return result;
  }, []);

  const searchQuestion = useCallback((data: any, key: string) => {
    if (data.id === key) {
      return data;
    }

    let result: any = null;
    if (data?.children?.length > 0) {
      data?.children.forEach((child: any) => {
        const found = searchQuestion(child, key);
        if (found != null) {
          result = found;
          return found;
        }

        return found;
      });
    }
    return result;
  }, []);

  const inputQuestionId = useRef<any>();

  const createNewNodeAtRoot = useCallback(
    (newNode: any, treeDataLocal: any[]) => {
      const newTree = addNodeUnderParent({
        treeData: treeDataLocal,
        parentKey: null,
        expandParent: true,
        getNodeKey,
        newNode,
      });

      return newTree;
    },
    [],
  );

  const addNodeSibling = useCallback(
    (rowInfo: any, newNode: any, treeDataLocal: any): any => {
      const { path } = rowInfo;

      setErrorMessage('');
      const newTree1 = { treeData: treeDataLocal };

      if (newNode.type === 'question') {
        const question = searchQuestion(treeDataLocal[0], newNode.id);

        if (question !== null) {
          setErrorMessage(`Question '${newNode.title}' was already added.`);
          return newTree1;
        }
      }

      if (
        rowInfo.node.type === 'question' &&
        rowInfo.parentNode &&
        rowInfo.parentNode.type === 'matrix' &&
        newNode.type !== 'question'
      ) {
        setErrorMessage(
          `Element ${newNode.type} cannot be inserted into a matrix`,
        );
        return newTree1;
      }

      if (rowInfo.node.type === 'pagebreak' && newNode.type !== 'pagebreak') {
        setErrorMessage(`Pagebreak cannot have ${newNode.type} as sibling`);
        return newTree1;
      }

      if (rowInfo.node.type !== 'pagebreak' && newNode.type === 'pagebreak') {
        setErrorMessage('Pagebreak can be only added to the root level!');
        return newTree1;
      }

      // validation: when the user tries to add a different element into a matrix
      if (
        rowInfo.parentNode &&
        rowInfo.parentNode.type === 'matrix' &&
        newNode.type === 'question'
      ) {
        // validation: when the user tries to add a question type different from Scale

        if (newNode.type !== 'question') {
          setErrorMessage('Only Scale questions are allowed in a Matrix!');
          return newTree1;
        }

        const rowInfoOptions = rowInfo.parentNode.children[0].question.options;
        const newNodeOptions = newNode.value.options;
        // validation: when the user tries to add a question with
        // different options from the first one added to the matrix
        if (!checkArrayEqualsIgnoreOrder(rowInfoOptions, newNodeOptions)) {
          setErrorMessage(
            'All the questions in a matrix must have the same options!',
          );

          return newTree1;
        }
      }

      if (newNode.type === 'pagebreak') {
        let newchildren: any[] = [];
        treeDataLocal.map((x: any) => {
          if (x === rowInfo.node) {
            newchildren.push(x);
            newchildren.push(newNode);
            return newchildren;
          }
          newchildren.push(x);
          return x;
        });

        newchildren = newchildren.map((x: any, index: number) => {
          const y = x;
          y.value = `Page ${index + 1}`;
          y.title = `Page ${index + 1}`;
          return y;
        });

        return {
          treeData: newchildren,
          treeIndex: 3,
        };
      }

      const newTree = {
        treeData: treeDataLocal.map((x: any) => {
          if (x.children) {
            const newchildren: any[] = [];
            x.children.map((y: any) => {
              if (y === rowInfo.node) {
                newchildren.push(y);
                newchildren.push(newNode);
                return newchildren;
              }

              if (y.children) {
                const newchildreninMatrix: any[] = [];
                y.children.map((z: any) => {
                  if (z === rowInfo.node) {
                    newchildreninMatrix.push(z);
                    newchildreninMatrix.push(newNode);
                    return newchildreninMatrix;
                  }

                  newchildreninMatrix.push(z);
                  return z;
                });
                // eslint-disable-next-line no-param-reassign
                y.children = newchildreninMatrix;
              }

              newchildren.push(y);
              return y;
            });

            // eslint-disable-next-line no-param-reassign
            x.children = newchildren;
          }
          return x;
        }),
        treeIndex: 0,
      };

      return newTree;
    },
    [checkArrayEqualsIgnoreOrder, searchQuestion],
  );

  const addNodeChild = useCallback(
    (rowInfo: any, newNode: any, treeDataLocal: any): any => {
      const { path } = rowInfo;
      const newTree1 = { treeData: treeDataLocal };
      setErrorMessage('');

      if (newNode.type === 'question') {
        const question = searchQuestion(treeDataLocal[0], newNode.id);

        if (question !== null) {
          setErrorMessage(`Question '${newNode.title}' was already added.`);
          return newTree1;
        }
      }

      if (rowInfo.node.type === 'pagebreak' && newNode.type === 'pagebreak') {
        setErrorMessage('Pagebreak can be only added to the root level!');
        return newTree1;
      }

      if (rowInfo.node.type === 'matrix' && newNode.type === 'question') {
        if (newNode.value.internalType !== 'Scale') {
          setErrorMessage('Matrix must have only Scale questions!');
          return newTree1;
        }
      }

      // validation: when the user tries to add a different element into a matrix
      if (rowInfo.node.type === 'matrix' && rowInfo.node.children.length >= 0) {
        // validation: when the user tries to add a question type different from Scale
        if (newNode.type !== 'question') {
          setErrorMessage('Only questions are allowed in a Matrix!');
          return newTree1;
        }

        if (rowInfo.node.children.length > 0) {
          const rowInfoOptions = rowInfo?.node?.children[0]?.question?.options;
          const newNodeOptions = newNode?.value?.options;

          // validation: when the user tries to add a question with
          // different options from the first one added to the matrix
          if (!checkArrayEqualsIgnoreOrder(rowInfoOptions, newNodeOptions)) {
            setErrorMessage(
              'All the questions in a matrix must have the same options!',
            );

            return newTree1;
          }
        }
      }

      const newTree3: any = addNodeUnderParent({
        treeData: treeDataLocal,
        newNode,
        parentKey: path[path.length - 1],
        getNodeKey,
        ignoreCollapsed: true,
        expandParent: true,
        addAsFirstChild: false,
      });
      setErrorMessage('');
      return newTree3;
    },
    [checkArrayEqualsIgnoreOrder, searchQuestion],
  );

  const handleAddChildOrSiblingQuestions = useCallback(
    async (rowInfo: any, typeAdding: string) => {
      let treeDataLocal = {
        treeData: [],
      };
      treeDataLocal.treeData = treeData;

      const { value } = inputQuestionId.current;

      if (value === '') {
        inputQuestionId.current.focus();
        return;
      }

      const values = value.replace(/,/g, ';');

      const questionIds = values.split(';');

      const response = await api.get(
        `/questions/getQuestionsByMultipleIds/${questionIds}`,
      );

      const resultQuestions: any[] = response.data;
      let areAllOptionsEquals = true;
      if (typeAdding === 'child' && rowInfo?.node?.type === 'matrix') {
        let previousQuestionOptions: any = [];

        resultQuestions.forEach((question: any, index: number) => {
          if (index > 0) {
            const actualQuestionOptions = question.options;

            if (
              !checkArrayEqualsIgnoreOrder(
                previousQuestionOptions,
                actualQuestionOptions,
              )
            ) {
              setErrorMessage(
                'All the questions in a matrix must have the same options!',
              );
              areAllOptionsEquals = false;
              return;
            }
          }
          previousQuestionOptions = question.options;
        });
      }

      if (!areAllOptionsEquals) {
        return;
      }

      let arrayQuestionsFinal: any = [];
      questionIds.forEach((questionIdString: string) => {
        const questionFound = resultQuestions.find(
          (question: any) =>
            question.questionId === parseInt(questionIdString, 10),
        );
        if (questionIdString.includes('.')) {
          const alternativeId = questionIdString.split('.')[1];

          const alternativeText = questionFound.alternatives.find(
            (alternative: any) =>
              alternative.value === parseInt(alternativeId, 10),
          );
          const newQuestion = {
            ...questionFound,
            questionId: questionIdString,
            title: alternativeText.text,
            text: alternativeText.text,
            name: `${checkNameNode(
              `${questionIdString}-${questionFound.text}`,
              'question',
              1,
            )}`,
            type: questionFound.type,
          };

          arrayQuestionsFinal.push(newQuestion);
        } else {
          arrayQuestionsFinal.push(questionFound);
        }
      });

      if (typeAdding !== 'child') {
        arrayQuestionsFinal = arrayQuestionsFinal.reverse();
      }

      arrayQuestionsFinal.forEach((question: any) => {
        const newNode = {
          id: question.questionId.toString(),
          order: 2,
          type: 'question',
          name: `${checkNameNode(
            `${question.questionId}-${question.text}`,
            'question',
            1,
          )}`,
          value: {
            ...question,
            type: getDefaultQuestionType(question.type),
            choices: question?.options,
            internalType: question.type,
            name: `${checkNameNode(
              `${question.questionId}-${question.text}`,
              'question',
              1,
            )}`,
            hideNumber: true,
          },
          title: `${question.questionId} - ${question.text}`,
          subtitle: 'question',
          isDirectory: false,
          expanded: false,
          question: {
            questionId: question.questionId,
            externalId: question.externalId,
            internalType: question.type,
            text: question.text,
            title: question.text,
            // name: question.text,
            type: getDefaultQuestionType(question.type),
            tags: question.tags,
            options: question.options,
            name: `${checkNameNode(
              `${question.questionId}-${question.text}`,
              'question',
              1,
            )}`,
            hideNumber: true,
          },
        };

        if (typeAdding === 'child') {
          treeDataLocal = addNodeChild(
            rowInfo,
            newNode,
            treeDataLocal.treeData,
          );
          return;
        }

        treeDataLocal = addNodeSibling(
          rowInfo,
          newNode,
          treeDataLocal.treeData,
        );
      });

      setTreeData(treeDataLocal.treeData);
    },
    [addNodeChild, addNodeSibling, checkArrayEqualsIgnoreOrder, treeData],
  );

  const handleCreateNode = useCallback(
    (typeElement, nodeType, rowInfo?) => {
      let treeDataLocal = {
        treeData: [],
      };
      treeDataLocal.treeData = treeData;

      let newNode = {};
      const pageBreakIndex = treeDataLocal.treeData.filter(
        (item: any) => item.type === 'pagebreak',
      );
      switch (typeElement) {
        case 'pagebreak':
          newNode = {
            id: '456',
            index: pageBreakIndex.length,
            order: 0,
            type: 'pagebreak',
            value: `Page ${pageBreakIndex.length + 1}`,
            title: `Page ${pageBreakIndex.length + 1}`,
            subtitle: 'pagebreak',
            children: [],
          };
          break;

        case 'htmlElement':
          newNode = {
            id: '456',
            index: treeDataLocal.treeData.length,
            order: 0,
            type: 'htmlElement',
            value: htmlText ?? document.getElementById('htmlText')?.textContent,
            html: htmlText ?? document.getElementById('htmlText')?.textContent,
            title: 'HTML Element',
            subtitle: 'html',
            name: checkNameNode('html', 'htmlElement', 1),
          };
          break;

        case 'image':
          // eslint-disable-next-line no-case-declarations
          const strOriginal: string = imageURL;
          newNode = {
            id: '456',
            index: treeDataLocal.treeData.length,
            order: 0,
            type: 'image',
            value: { value: imageURL },
            title: 'Image Element',
            subtitle: 'image',
            name: checkNameNode(
              strOriginal.substring(
                strOriginal.indexOf('/files/') + 7,
                strOriginal.lastIndexOf('.'),
              ),
              'image',
              1,
            ),
          };
          break;

        case 'matrix':
          // eslint-disable-next-line no-case-declarations
          const matrixCount = treeDataLocal.treeData
            .flatMap((node: any) =>
              node?.children?.flatMap((child: any) => child),
            )
            .filter((item: any) => item.type === 'matrix').length;

          newNode = {
            id: `${matrixCount + 1}`,
            index: treeDataLocal.treeData.length,
            order: 0,
            // name: `${matrixTitle ?? 'Matrix'}-${matrixCount + 1}`,
            name: checkNameNode(`${matrixTitle ?? 'Matrix'}`, 'matrix', 1),
            type: 'matrix',
            value: {},
            title: checkNameNode(`${matrixTitle ?? 'Matrix'}`, 'matrix', 1),
            subtitle: 'Matrix',
            children: [],
          };

          break;
        case 'question':
          handleAddChildOrSiblingQuestions(rowInfo, 'child');
          return;

        default:
          break;
      }

      switch (nodeType) {
        case 'child':
          treeDataLocal = addNodeChild(
            rowInfo,
            newNode,
            treeDataLocal.treeData,
          );
          break;

        case 'sibling':
          treeDataLocal = addNodeSibling(
            rowInfo,
            newNode,
            treeDataLocal.treeData,
          );
          break;

        case 'normal':
          treeDataLocal = createNewNodeAtRoot(newNode, treeDataLocal.treeData);
          break;
        default:
          break;
      }
      setDataChanged(true);
      localStorage.setItem('@Victor:dataChanged', JSON.stringify(true));
      setTreeData(treeDataLocal.treeData);
    },
    [
      addNodeChild,
      addNodeSibling,
      createNewNodeAtRoot,
      handleAddChildOrSiblingQuestions,
      htmlText,
      imageURL,
      matrixTitle,
      treeData,
    ],
  );

  const removeNode = useCallback(
    rowInfo => {
      if (treeData.length === 1 && rowInfo.node.type === 'pagebreak') {
        setErrorMessage(
          'Cannot remove this element. The skeleton must have at least one page!',
        );
        return;
      }
      const { path } = rowInfo;
      setDataChanged(true);
      localStorage.setItem('@Victor:dataChanged', JSON.stringify(true));
      setTreeData(
        removeNodeAtPath({
          treeData,
          path,
          getNodeKey,
        }),
      );
    },
    [treeData],
  );

  const updateTreeData = useCallback((treeDataParam: any) => {
    setTreeData(treeDataParam);
  }, []);

  const expand = useCallback(
    expanded => {
      setTreeData(
        toggleExpandedForAll({
          treeData,
          expanded,
        }),
      );
    },
    [treeData],
  );

  const expandAll = useCallback(() => {
    expand(true);
  }, [expand]);

  const collapseAll = useCallback(() => {
    expand(false);
  }, [expand]);

  const alertNodeInfo = useCallback(({ node, path, treeIndex }) => {
    if (
      node.type === 'matrix' ||
      (node.type === 'question' &&
        (node?.question?.internalType === 'Scale' ||
          node?.question?.internalType === 'SelectMultiple'))
    ) {
      let choices;

      if (node.type === 'matrix') {
        choices = node.children[0].question.options;
      } else {
        choices = node.question.options;
      }
      const choicesToShow = choices.map((choice: any) => {
        return `Value: ${choice.value} - Text: ${choice.text}\n`;
      });

      global.alert(
        `Question Answers:\n\n${choicesToShow
          .toString()
          .replace(/^\s*[,]/gm, '')}`,
      );
    }
  }, []);

  const selectPrevMatch = useCallback(() => {
    if (searchFoundCount) {
      setSearchFocusIndex(
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
      );
    }
  }, [searchFocusIndex, searchFoundCount]);

  const selectNextMatch = useCallback(() => {
    if (searchFoundCount) {
      setSearchFocusIndex(
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
      );
    }
  }, [searchFocusIndex, searchFoundCount]);

  const handleApplyChanges = useCallback(() => {
    try {
      const skeletonToSave = {
        surveyId: props.surveyId,
        skeletonTree: treeData,
      };

      api.get(`/surveys/${props.surveyId}`).then(response => {
        if (response && response.data && response.data?.isLocked === true) {
          addToast({
            type: 'error',
            title: 'Registration Error',
            description:
              'Changes not saved. This survey is locked. Please reload the page to get most recent data.',
          });
        } else {
          api.get(`/skeletons/survey/${props.surveyId}`).then(responseGet => {
            if (responseGet.data) {
              api
                .put(`/skeletons/survey/${props.surveyId}`, skeletonToSave)
                .then(responsePut => {
                  props.setSkeleton(skeletonToSave);
                  localStorage.setItem(
                    '@Victor:treeData',
                    JSON.stringify(treeData),
                  );
                  setDataChanged(false);
                  localStorage.setItem(
                    '@Victor:dataChanged',
                    JSON.stringify(false),
                  );

                  props.handleGenerateSurvey();
                });
            } else {
              api.post(`/skeletons`, skeletonToSave).then(responsePost => {
                props.setSkeleton(skeletonToSave);
                localStorage.setItem(
                  '@Victor:treeData',
                  JSON.stringify(treeData),
                );
                setDataChanged(false);
                localStorage.setItem(
                  '@Victor:dataChanged',
                  JSON.stringify(false),
                );
                props.handleGenerateSurvey();
              });
            }
          });
        }
      });
    } catch (err) {
      console.log('err', err);
    }
  }, [addToast, props, treeData]);

  const handleCancelChanges = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Do you really want to discard changes?')) {
      const localTreeDataString =
        localStorage.getItem('@Victor:treeData') ?? '{}';
      setTreeData(JSON.parse(localTreeDataString));
      setDataChanged(false);
      localStorage.setItem('@Victor:dataChanged', JSON.stringify(false));
      addToast({
        type: 'info',
        title: 'Cancel',
        description: 'Changes were canceled!',
      });
    }
  }, [addToast]);

  const canDrop = useCallback(
    (item: any): boolean => {
      // validation: when the user tries to add a different element into a matrix

      if (
        item.node.type === 'question' &&
        item?.nextParent?.type === 'matrix'
      ) {
        // validation: when the user tries to add a question type different from Scale
        if (item?.node?.question?.internalType !== 'Scale') {
          return false;
        }

        const rowInfoOptions = item?.nextParent?.children[0]?.question?.options;
        const newNodeOptions = item?.node?.question?.options;

        // validation: when the user tries to add a question with
        // different options from the first one added to the matrix
        if (!checkArrayEqualsIgnoreOrder(rowInfoOptions, newNodeOptions)) {
          return false;
        }
      }

      if (item.nextParent?.type === 'question') {
        return false;
      }

      if (
        item.node?.type === 'question' &&
        item.nextParent?.type !== 'pagebreak' &&
        item.nextParent?.type !== 'matrix'
      ) {
        return false;
      }

      if (item.node.type === 'image' && item.nextParent?.type !== 'pagebreak') {
        return false;
      }

      if (
        item.node.type === 'htmlElement' &&
        item.nextParent?.type !== 'pagebreak'
      ) {
        return false;
      }

      if (item.node?.type === 'pagebreak' && item.nextParent) {
        return false;
      }

      if (item.node?.type === 'pagebreak') {
        const pgb = treeData.filter((i: any) => i.type === 'pagebreak');
        pgb.forEach((element: any, index: number) => {
          // eslint-disable-next-line no-param-reassign
          element.title = `Page ${index + 1}`;
          // eslint-disable-next-line no-param-reassign
          element.value = `Page ${index + 1}`;
        });
      }

      if (
        item.node.type === 'matrix' &&
        item.nextParent?.type !== 'pagebreak'
      ) {
        return false;
      }

      return true;
    },
    [checkArrayEqualsIgnoreOrder, treeData],
  );

  return (
    <div>
      {!props.surveyIslocked && (
        <Button
          type="button"
          onClick={() => handleApplyChanges()}
          width={'275px'}
          style={{ marginRight: 20, paddingLeft: 10, paddingRight: 10 }}
        >
          Save Changes & Generate Survey
        </Button>
      )}
      <Button
        type="button"
        onClick={() => handleCancelChanges()}
        width={'275px'}
      >
        Cancel Changes
      </Button>
      <div style={{ flex: '0 0 auto', padding: '0 10px' }}>
        <br />
        <br />
        <BoxRadioButtons>
          <SelectorButtonElement
            id="questionsRadio"
            label="Questions"
            name="radio"
            value={'question'}
            disabled={false}
            onChange={({ target }: any) => setRadio(target.value)}
            checked={radioValue === 'question'}
          />
          <SelectorButtonElement
            id="pageRadio"
            label="Page"
            name="radio"
            value={'pagebreak'}
            disabled={false}
            onChange={({ target }: any) => setRadio(target.value)}
            checked={radioValue === 'pagebreak'}
          />
          <SelectorButtonElement
            id="htmlRadio"
            label="HTML"
            name="radio"
            value={'htmlElement'}
            disabled={false}
            onChange={({ target }: any) => setRadio(target.value)}
            checked={radioValue === 'htmlElement'}
          />
          <SelectorButtonElement
            id="imageRadio"
            label="Image"
            name="radio"
            value={'image'}
            disabled={false}
            onChange={({ target }: any) => setRadio(target.value)}
            checked={radioValue === 'image'}
          />
          <SelectorButtonElement
            id="matrixRadio"
            label="Matrix"
            name="radio"
            value={'matrix'}
            disabled={false}
            onChange={({ target }: any) => setRadio(target.value)}
            checked={radioValue === 'matrix'}
          />
        </BoxRadioButtons>
        <br />
        {radioValue === 'question' ? (
          <div id="boxAddQuestion">
            <textarea
              name="questionIds"
              placeholder="Type question IDs"
              ref={inputQuestionId}
              style={{
                width: '60em',
                height: '8em',
                padding: 5,
                resize: 'none',
              }}
            />
            <br />
            <br />
          </div>
        ) : (
          <></>
        )}
        {radioValue === 'matrix' ? (
          <>
            <input
              name="matrixTitle"
              type="text"
              // value="Matrix"
              placeholder="Type Matrix title"
              onChange={e => setMatrixTitle(e.target.value)}
              style={{
                width: '50em',
                padding: 5,
                resize: 'none',
              }}
            ></input>
            <br />
          </>
        ) : radioValue === 'image' ? (
          <>
            <input
              name="imageLink"
              type="text"
              placeholder="Type Image URL"
              onChange={e => setImageURL(e.target.value)}
              style={{
                width: '50em',
                padding: 5,
                resize: 'none',
              }}
            ></input>
            <br />
          </>
        ) : radioValue === 'htmlElement' ? (
          <>
            <textarea
              id="htmlText"
              name="htmlText"
              placeholder="Type HTML"
              onChange={e => setHtmlText(e.target.value)}
              value={htmlText}
              style={{
                width: '60em',
                height: '8em',
                padding: 5,
                resize: 'none',
              }}
            ></textarea>

            <br />
          </>
        ) : (
          <></>
        )}
        <br />
        <div>
          <button
            onClick={expandAll}
            style={{ marginRight: 20, paddingLeft: 10, paddingRight: 10 }}
          >
            + Expand All
          </button>
          <button
            onClick={collapseAll}
            style={{ marginRight: 20, paddingLeft: 13, paddingRight: 13 }}
          >
            - Collapse All
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'none' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event => setSearchString(event.target.value)}
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>
            {searchFoundCount && (
              <span>
                &nbsp;
                {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
                &nbsp;/&nbsp;
                {searchFoundCount || 0}
              </span>
            )}
          </form>
        </div>
      </div>
      <span style={{ color: 'red' }}>{errorMessage}</span>

      <div style={{ height: '50vh' }}>
        <SortableTree
          treeData={treeData}
          canDrop={canDrop}
          onMoveNode={() => {
            setDataChanged(true);
            localStorage.setItem('@Victor:dataChanged', JSON.stringify(true));
          }}
          onChange={(treeDataParam: any) => updateTreeData(treeDataParam)}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={(matches: any[]) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0,
            );
          }}
          canDrag={({ node }: any) => !node.dragDisabled}
          generateNodeProps={(rowInfo: any) => ({
            buttons: [
              <div key={rowInfo.node.index}>
                {radioValue === 'question' ? (
                  <button
                    title="Add Sibling"
                    onClick={() =>
                      handleAddChildOrSiblingQuestions(rowInfo, 'sibling')
                    }
                    style={{
                      fontSize: 12,
                      width: 90,
                      marginRight: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    Add Sibling
                  </button>
                ) : (
                  <button
                    title="Add Sibling"
                    onClick={() => {
                      handleCreateNode(radioValue, 'sibling', rowInfo);
                    }}
                    style={{
                      fontSize: 12,
                      width: 90,
                      marginRight: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    Add Sibling
                  </button>
                )}
                {rowInfo.node.type === 'pagebreak' ||
                rowInfo.node.type === 'matrix' ? (
                  <button
                    aria-label="Add Child"
                    onClick={() =>
                      handleCreateNode(radioValue, 'child', rowInfo)
                    }
                    style={{
                      fontSize: 12,
                      width: 90,
                      marginRight: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    Add Child
                  </button>
                ) : (
                  <></>
                )}

                <button
                  aria-label="Delete"
                  onClick={() => removeNode(rowInfo)}
                  style={{
                    fontSize: 12,
                    width: 90,
                    marginRight: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  Remove
                </button>
                {rowInfo.node.type === 'matrix' ||
                (rowInfo.node.type === 'question' &&
                  (rowInfo.node?.question?.internalType === 'Scale' ||
                    rowInfo.node?.question?.internalType ===
                      'SelectMultiple')) ? (
                  <button
                    aria-label="Alert"
                    onClick={() => alertNodeInfo(rowInfo)}
                    style={{
                      fontSize: 12,
                      width: 90,
                      marginRight: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    Answers
                  </button>
                ) : (
                  <></>
                )}
              </div>,
            ],
            style: {
              height: '50px',
            },
          })}
        />
      </div>
    </div>
  );
};
SortTree.displayName = 'SortTree';

export default SortTree;
