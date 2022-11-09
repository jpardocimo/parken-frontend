export const getElementsWithoutId: any = (elements: any[]) => {
  const elementsWithoutId = elements.map((element: any) => {
    if (element.type === 'matrix') {
      const itemWithoutId = {
        ...element,
        title: element?.title?.trim().includes(element?.matrixId.toString())
          ? element?.title.split('-').slice(1).join('-').trim()
          : element?.title, // remove matrix id to show the questionnaire
        rows: element?.rows.map((row: any) => {
          return {
            ...row,
            text: row.text.trim().includes(row.questionId.toString())
              ? row.text.split('-').slice(1).join('-').trim()
              : row.text, // remove question id (matrixRows) to show the questionnaire
          };
        }),
      };
      return itemWithoutId;
    }

    const itemWithoutId = {
      ...element,
      title: element?.title?.trim().includes(element?.questionId?.toString())
        ? element?.title.split('-').slice(1).join('-').trim()
        : element?.title, // remove question id to show the questionnaire
    };
    return itemWithoutId;
  });

  return elementsWithoutId;
};
