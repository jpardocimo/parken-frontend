/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-explicit-any */
const getDecodedSurvey = (surveyJsonFromDb: any): string => {
  const surveyToLoad: any = { ...surveyJsonFromDb }; // clone needed to loop the original and change the copy

  // carrega a primeira página com as propriedades dela e com os elementos tbm
  const uniqueDesignerPage: any = { ...surveyJsonFromDb.pages[0] };

  // inicializa um array de pages com a primeira página (só vai existir uma mesmo)
  const surveyPages: any[] = [{ ...uniqueDesignerPage }];
  surveyPages[0].elements = [];

  // loop nas págnas do array original
  for (let i = 0; i < surveyJsonFromDb.pages.length; i += 1) {
    const { elements } = surveyJsonFromDb.pages[i];

    for (let j = 0; j < elements.length; j += 1) {
      let expressionValidator = '';
      if (elements[j].matrixId) {
        // eslint-disable-next-line no-loop-func
        elements[j].rows = elements[j]?.rows?.map((row: any) => {
          expressionValidator += `{${elements[j].name}.${row.value}} notempty and`;

          const localMatrixRow = {
            questionIdMatrix: row.questionId,
            externalId: row.externalId,
            rowVisibleIf: row.visibleIf,
            text: row.text?.trim().includes(row.questionId)
              ? `${row.text}`
              : `${row.questionId} - ${row.text}`,
            value: row.questionId,
            numberOfRowsToSplit: row.numberOfRowsToSplit,
            splitMatrix: row.splitMatrix,
            totalOfRows: row?.numberOfRowsToSplit,
            numberOfGroups: row.numberOfGroups,
            numberOfGroupsToInsertPageBreakAfter:
              row.numberOfGroupsToInsertPageBreakAfter,
          };

          return localMatrixRow;
        });

        if (elements[j].validators && !elements[j].isAllRowRequired) {
          if (
            elements[j].validators.some(
              (validator: any) =>
                validator.expression === expressionValidator.slice(0, -3),
            )
          ) {
            elements[j].isAllRowRequired = true;
          }
        }
      } else if (elements[j].questionId) {
        elements[j].title = elements[j].title
          ?.trim()
          .includes(elements[j].questionId)
          ? `${elements[j].title}`
          : `${elements[j].questionId} - ${elements[j].title}`;
      }
    }

    surveyPages[0].elements.push(...elements);

    if (i !== surveyJsonFromDb.pages.length - 1) {
      surveyPages[0].elements.push({
        type: 'pagebreak',
        name: 'pagebreak',
        title: surveyJsonFromDb.pages[i + 1].title,
      });
    }
  }
  surveyToLoad.pages = [...surveyPages];

  return surveyToLoad;
};
export default getDecodedSurvey;
