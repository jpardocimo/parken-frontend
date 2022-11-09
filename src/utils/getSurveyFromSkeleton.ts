import getDefaultQuestionType from './getDefaultQuestionType';

const getSurveyFromSkeleton = (tree: any[]): any => {
  const elementsArray: any[] = [];

  tree.forEach((node: any, index: number) => {
    switch (node.type) {
      case 'pagebreak':
        if (node.children) {
          if (index > 0) {
            elementsArray.push({
              type: node.type,
              name: node.type,
              title: node.title,
            });
          }

          const sub = getSurveyFromSkeleton(node.children);

          elementsArray.push(...sub);
        }
        break;
      case 'matrix':
        if (node.children) {
          elementsArray.push({
            ...node.value,
            type: 'matrix',
            descriptionLocation: 'underTitle',
            matrixId: node.id,
            hideNumber: true,
            name: node.name,
            title: node.title,
            visibleIf: node?.visibleIf,
            columns: node?.children && node?.children[0]?.question?.options,
            numberOfRowsToSplit: node.numberOfRowsToSplit,
            totalOfRows: node.numberOfRowsToSplit,
            splitMatrix: node.splitMatrix,
            numberOfGroups: node?.numberOfGroups,
            numberOfGroupsToInsertPageBreakAfter:
              node?.numberOfGroupsToInsertPageBreakAfter,
            rows: node?.children.map((child: any) => {
              return {
                questionIdMatrix: child.question.questionId,
                externalId: child.question.externalId,
                questionType: getDefaultQuestionType(child.question.type),
                internalType: child.question.type,
                value: child.question.questionId,
                text: `${child.title}`,
                questionId: child.value,
                rowVisibleIf: child.rowVisibleIf,
              };
            }),
          });
        }
        break;
      case 'question':
        elementsArray.push({
          ...node.value,
          name: node?.name,
          title: node.title,
          hideNumber: true,
        });
        break;
      case 'htmlElement':
        elementsArray.push({
          ...node.value,
          type: 'html',
          name: node.name,
          html: node.html,
        });
        break;
      case 'image': {
        elementsArray.push({
          ...node.value,
          type: 'image',
          name: node.name, // name:'image_sq_192'
          // imageLink: node.value.imageLink,
        });
        break;
      }
      default:
        break;
    }
  });

  return elementsArray;
};
export default getSurveyFromSkeleton;
