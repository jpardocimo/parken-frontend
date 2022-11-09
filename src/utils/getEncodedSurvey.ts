/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-continue */

/* eslint-disable @typescript-eslint/no-explicit-any */
const getEncodedSurvey = (text: string): any => {
  const surveyJsonStructure = JSON.parse(text);
  const surveyToSave: any = { ...surveyJsonStructure }; // clone needed to loop the original and change the copy

  // check if need split pages
  const uniqueDesignerPage: any = { ...surveyJsonStructure.pages[0] };
  const pageBeakers =
    uniqueDesignerPage &&
    uniqueDesignerPage.elements?.filter((e: any) => {
      return e?.type === 'pagebreak';
    });

  // end check if need split pages

  // create pages array with the exact lenght
  const pages: object[] = [pageBeakers?.length];
  uniqueDesignerPage.elements = [];

  // set the first page preserving first page properties
  pages[0] = { ...uniqueDesignerPage };

  surveyToSave.pages = pages; // clean clone elements to receive new pages with it splited

  // split pages
  let pageIndex = 1;
  for (let i = 0; i < surveyJsonStructure.pages[0]?.elements?.length; i += 1) {
    let element = surveyJsonStructure.pages[0]?.elements[i];

    if (element.isRequired) {
      element.requiredErrorText = 'Bitte eine Antwort geben';
      element.requiredText = ''; // remove * required text from question title (required Text)
    }

    if (element.internalType === 'Text') {
      element = {
        ...element,
        placeHolder: 'Bitte tippen Sie Ihre Antwort hier...',
      };
    }

    if (element?.matrixId && element.rows) {
      let strValidator = '';
      element.rows = element?.rows?.map((row: any) => {
        if (element.isAllRowRequired) {
          // creating the expression for validator
          strValidator += `{${element.name}.${row.value}} notempty and`;
        }

        return {
          questionId: row.value,
          externalId: row.externalId,
          visibleIf: row.rowVisibleIf,
          value: row.value,
          text: row.text,
          numberOfRowsToSplit: row.numberOfRowsToSplit,
          splitMatrix: row.splitMatrix,
          totalOfRows: row?.numberOfRowsToSplit,
          numberOfGroups: row.numberOfGroups,
          numberOfGroupsToInsertPageBreakAfter:
            row.numberOfGroupsToInsertPageBreakAfter,
        };
      });

      if (element.isAllRowRequired) {
        // create an expression automatically to require all rows in a matrix and shows the message 'Bitte eine Antwort geben'
        const objValidator = {
          type: 'expression',
          text: 'Bitte beantworten Sie alle Fragen',
          expression: strValidator.slice(0, -3),
        };

        element.isAllRowRequired = false; // Must be false, otherwise the surveyJS shows its own message
        element.validators = [objValidator]; // always overrides the validator
      } else {
        element.validators = [];
      }
    }

    if (element.type === 'pagebreak') {
      pageIndex += 1;
      surveyToSave.pages.push({
        name: `page${pageIndex}`,
        title: element.title,
        elements: [],
      });
      continue;
    }

    surveyToSave.pages[pageIndex - 1].elements?.push(element);
  }

  return surveyToSave;
};

export default getEncodedSurvey;
