import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import SurveyPage from '../../../../components/SurveyComponent/SurveyJson/Survey';

import api from '../../../../services/api';

import { Header, Footer } from './styles';
import { Container } from '../../../Questionnaire/styles';
import logoEb from '../../../../assets/eb-logo.svg';
import { getSplittedMatrix } from '../../../../utils/getSplittedMatrix';
import { getElementsWithoutId } from '../../../../utils/getElementsWithoutId';

interface SurveyParams {
  surveyId: string;
}

interface Logo {
  id: number;
  filePath: string;
}

interface SurveyText {
  surveyTextId: number;
  text: string;
  isStartText: boolean;
}

interface Survey {
  idSurvey: number;
  isTemplate: boolean;
  name: string;
  title: string;
  pages: object[];
  projectId: number;
  subGroup: string;
  logo: Logo;
  startText: SurveyText;
  finalText: SurveyText;
}

const Survey: React.FC = () => {
  const [survey, setSurvey] = useState<Survey>();
  const { params } = useRouteMatch<SurveyParams>();

  useEffect(() => {
    api.get(`/surveys/${params.surveyId}`).then(response => {
      const formattedPages: any[] = [];

      if (
        response.data &&
        response.data.startText &&
        response.data.placeholders
      ) {
        response.data.placeholders.forEach((placeholder: any) => {
          response.data.startText.text = response.data.startText.text.replace(
            placeholder.searchValue,
            placeholder.replaceValue,
          );
        });
      }

      if (
        response.data &&
        response.data.completedHtml &&
        response.data.placeholders
      ) {
        response.data.placeholders.forEach((placeholder: any) => {
          response.data.completedHtml = response.data.completedHtml.replace(
            placeholder.searchValue,
            placeholder.replaceValue,
          );
        });
      }

      response.data?.pages.map((page: any) => {
        const customPages: any[] = [];
        let elementsPerPage: any[] = [];
        page.elements.map((element: any, index: number) => {
          if (response.data.placeholders) {
            response.data.placeholders.forEach((placeholder: any) => {
              if (element.type === 'matrix') {
                element?.rows?.map((x: any) => {
                  const y = x;
                  y.text = x.text.replace(
                    placeholder.searchValue,
                    placeholder.replaceValue,
                  );
                  return y;
                });

                element?.columns?.map((x: any) => {
                  const y = x;
                  y.text = x.text.replace(
                    placeholder.searchValue,
                    placeholder.replaceValue,
                  );
                  return y;
                });
              }

              const questionTitlePlaceHolder = element;

              questionTitlePlaceHolder.title = element?.title?.replace(
                placeholder.searchValue,
                placeholder.replaceValue,
              );

              if (
                questionTitlePlaceHolder &&
                questionTitlePlaceHolder.choices
              ) {
                questionTitlePlaceHolder.choices.map((x: any) => {
                  const y = x;
                  const optionTextPalceHolder: string = y.text;
                  y.text = optionTextPalceHolder.replace(
                    placeholder.searchValue,
                    placeholder.replaceValue,
                  );

                  return y;
                });
              }
            });
          }

          if (element.type !== 'matrix') {
            if (customPages.length === 0) {
              elementsPerPage.push(element);
              return element; // next loop
            }
            customPages[customPages.length - 1].elements.push(element);
            return element; // next loop
          }

          if (
            element.type === 'matrix' &&
            element?.splitMatrix &&
            element?.numberOfRowsToSplit < element?.rows?.length
          ) {
            const splittedMatrix = getSplittedMatrix(element);

            if (element.numberOfGroupsToInsertPageBreakAfter > 0) {
              let countAux = 1;
              for (let i = 0; i < splittedMatrix.length; i += 1) {
                // push matrixes into newPages
                if (
                  countAux === element.numberOfGroupsToInsertPageBreakAfter &&
                  i !== splittedMatrix.length - 1
                ) {
                  elementsPerPage.push({ ...splittedMatrix[i] });

                  // conditions to generate a new page
                  // if matrix it's the first element on page or if it's the first group of a matrix
                  // and a previous page does NOT exists, then create a new page
                  if (
                    index === 0 ||
                    (element.numberOfGroupsToInsertPageBreakAfter - i - 1 ===
                      0 &&
                      customPages.length === 0)
                  ) {
                    customPages.push({
                      name: `page${i}_${element.matrixId}`,
                      elements: elementsPerPage,
                    });
                  } else {
                    // if it's NOT the first group of a matrix or if matrix it's NOT the first element on page
                    // a new page will not be created, just add into the last page created
                    customPages[customPages.length - 1].elements.push(
                      ...elementsPerPage,
                    );
                  }
                  countAux = 1;
                  elementsPerPage = [];
                } else if (i === splittedMatrix.length - 1) {
                  // create a new page for the last group of the matrix
                  elementsPerPage.push({ ...splittedMatrix[i] });

                  customPages.push({
                    name: `page${i}_${element.matrixId}`,
                    elements: elementsPerPage,
                  });

                  elementsPerPage = [];
                } else {
                  elementsPerPage.push({ ...splittedMatrix[i] });
                  countAux += 1;
                }
              }
              // end of matrix pages - goto next element
              return element; // next loop
            }

            // the matrix was splitted in groups but all groups will be added in the same page
            elementsPerPage.push(...splittedMatrix);
            return element; // next loop
          }

          // it's a matrix, but the user doesn't want to split it
          // the entire element will be added to the survey in the original form
          elementsPerPage.push(element);
          return element; // next loop
        });

        if (customPages.length > 0) {
          formattedPages.push(...customPages);
        } else {
          formattedPages.push({ ...page, elements: elementsPerPage }); // when the page has only simpleElments (customPages.length ===0)
        }

        const newPage = { ...page, elements: [] }; // return fake page just to return something
        return newPage;
      });

      // remove ids from the question's names
      const formattedPagesWithoudElementIds = formattedPages.map(
        (page: any) => {
          return {
            ...page,
            elements: getElementsWithoutId(page.elements),
          };
        },
      );

      const surveyTmp = {
        ...response.data,
        idSurvey: params.surveyId,
        pages: formattedPagesWithoudElementIds,
      };
      delete surveyTmp.surveyId;
      setSurvey(surveyTmp);
    });
  }, [params.surveyId]);

  return (
    <>
      <Header>
        <img src={logoEb} alt="Logo - Survey" />
      </Header>

      <Container
        useStyle={false}
        mainColor={'#1AB394'}
        showFinalMessage={false}
      >
        <SurveyPage model={survey} />
      </Container>

      <Footer />
    </>
  );
};

export default Survey;
