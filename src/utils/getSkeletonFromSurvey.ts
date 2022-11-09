const getSkeletonFromSurvey = (surveyText: string): any => {
  let surveyElementsLocal = [];

  const survey = surveyText && JSON.parse(surveyText);
  const skeletonTree: any[] = [];
  const { surveyId } = survey;

  surveyElementsLocal = survey.pages[0].elements;

  if (survey.pages.length === 1) {
    surveyElementsLocal.unshift({
      name: 'pagebreak',
      type: 'pagebreak',
    });
  }

  let lastPage = 1;
  let pagenumber = 0;

  const matrixIds: any[] = [];
  surveyElementsLocal.forEach(async (element: any, index: number) => {
    let newNode1: any = {};

    if (element.type === 'pagebreak') {
      newNode1 = {
        id: index,
        order: lastPage,
        type: 'pagebreak',
        value: element.value,
        title: `Page ${lastPage}`,
        subtitle: 'pagebreak',
        children: [],
      };

      skeletonTree.push(newNode1);
      lastPage += 1;
      pagenumber = index === 0 ? pagenumber : (pagenumber += 1);
    }

    switch (element.type) {
      case 'image':
        newNode1 = {
          id: 3,
          order: index,
          type: 'image',
          value: element,
          title: 'Image Element',
          subtitle: 'image',
          children: [],
        };

        skeletonTree[pagenumber]?.children?.push(newNode1);
        break;
      case 'html':
        newNode1 = {
          id: 3,
          order: index,
          type: 'htmlElement',
          value: element,
          html: element.html,
          title: 'HTML Element',
          subtitle: 'html',
          children: [],
        };

        skeletonTree[pagenumber]?.children?.push(newNode1);
        break;
      case 'matrix':
        newNode1 = {
          id: index,
          order: index,
          type: 'matrix',
          descriptionLocation: element?.descriptionLocation,
          value: element,
          name: element.name,
          title: element.title,
          subtitle: 'matrix',
          visibleIf: element?.visibleIf,
          text: element.text,
          numberOfRowsToSplit: element?.numberOfRowsToSplit,
          splitMatrix: element?.splitMatrix,
          totalOfRows: element?.numberOfRowsToSplit,
          numberOfGroups: element?.numberOfGroups,
          numberOfGroupsToInsertPageBreakAfter:
            element?.numberOfGroupsToInsertPageBreakAfter,
          children: [],
        };

        matrixIds.push(index);
        element?.rows?.forEach((row: any) => {
          const newRow = {
            id: row.questionIdMatrix,
            order: index,
            type: 'question',
            name: row.text.trim().split('-')[1] ?? row.text,
            questionId: row.value,
            externalId: row.externalId,
            rowVisibleIf: row.rowVisibleIf,
            value: row.value,
            text: row.text,
            title: row.text,
            subtitle: 'question',
            isDirectory: false,
            expanded: false,
            question: {
              questionId: row.questionIdMatrix,
              externalId: row.externalId,
              internalType: 'Scale',
              text: row.text,
              title: row.questionIdMatrix,
              name: row.text.trim().split('-')[1] ?? row.text,
              type: 'radiogroup',
              tags: '',
              options: element.columns,
            },
          };
          newNode1.children.push(newRow);
        });

        skeletonTree[pagenumber]?.children?.push(newNode1);

        break;

      case 'dropdown':
      case 'ranking':
      case 'radiogroup':
      case 'barrating':
      case 'ebemotionsratings':
      case 'rating':
      case 'ebslider':
      case 'comment':
      case 'text':
      case 'checkbox':
        newNode1 = {
          id: 3,
          order: index,
          externalId: element.externalId,
          type: 'question',
          name: element.name,
          value: element,
          title: element.title,
          subtitle: 'question',
          isDirectory: false,
          expanded: false,
        };

        skeletonTree[pagenumber]?.children?.push(newNode1);
        break;
      default:
        break;
    }
  });

  const skeleton = {
    skeletonTree,
    surveyId,
  };

  return skeleton;
};
export default getSkeletonFromSurvey;
