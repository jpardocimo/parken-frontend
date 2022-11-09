/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

// split matrix if has more than 10 rows (create copies with 10 rows each)
// because matrixes with more than 10 rows gets too long in questionnaire page
// this way the title of options will repeat for each 10 questions of matrix
export const getSplittedMatrix = (element: any) => {
  const matrixArraySplited = [];

  // gets the number of "groups" with 10 rows of matrix
  const { numberOfRowsToSplit } = element;
  const countSplitRows = Math.ceil(element?.rows?.length / numberOfRowsToSplit);

  // loop number of groups to create each group slicing elements
  // here the matrix will be duplicated in the database (survey collection)
  // but the rows inside it(questions) will be differente for each group
  for (let count = 0; count < countSplitRows; count += 1) {
    if (count !== countSplitRows - 1) {
      const newMatrixesArray1 = {
        ...element,
        rows: element.rows.slice(
          count * numberOfRowsToSplit,
          count * numberOfRowsToSplit + numberOfRowsToSplit,
        ),
      };

      // pushes the splitted matrix to a temporary array
      matrixArraySplited.push(newMatrixesArray1);
    } else {
      // a different logic for the last group(page) because the last group can have less than 10 rows

      const lastGroup = parseInt(
        (
          (element.rows.length / numberOfRowsToSplit -
            Math.floor(element.rows.length / numberOfRowsToSplit)) *
          10
        ).toString(),
        10,
      );

      const newMatrixesArray2 = {
        ...element,
        rows: element.rows.splice(
          count * numberOfRowsToSplit,
          count * numberOfRowsToSplit + lastGroup,
        ),
      };

      // pushes the splitted matrix to a temporary array
      matrixArraySplited.push(newMatrixesArray2);
    }
  }
  return matrixArraySplited;
};
