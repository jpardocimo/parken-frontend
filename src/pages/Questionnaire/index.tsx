/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';

import { useRouteMatch } from 'react-router-dom';

import { FiAlertTriangle } from 'react-icons/fi';

import StartPage from './Start';
import SurveyPage from '../../components/SurveyComponent/SurveyJson/Survey';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useQuery } from '../../hooks/queryString';

import {
  Header,
  Container,
  Footer,
  AlertMessage,
  HeaderImage,
  AlertMessageLeaving,
} from './styles';

import EnumQuestionType from '../../utils/enums/EnumQuestionType';
import EnumChartType from '../../utils/enums/EnumChartType';
import { getSplittedMatrix } from '../../utils/getSplittedMatrix';
import { getElementsWithoutId } from '../../utils/getElementsWithoutId';

import RadarContainer from '../../components/Charts/Radar/RadarContainer';

import OverlayBox from '../../components/OverlayBox';
import BubbleTreeContainer from '../../components/Charts/BubbleTree/BubbleTreeContainer';
import { useMousePosition } from '../../hooks/mousePosition';
import Modal from '../../components/Modal/Modal';

const accessLockedMessage = 'Diese Umfrage ist nicht mehr aktiv.'; // 'The survey is no longer available.';
const codeDontExistsMessage = 'Dieser Teilnahmecode ist ungültig.'; // 'The Code does not exist!';
const surveyCompletedMessage =
  'Sie haben bereits an der Umfrage teilgenommen. Vielen Dank für Ihre Teilnahme.';
// 'You have already completed this survey. Thank you for participating.';

interface SurveyParams {
  accessId: string;
  code: string;
}

interface Logo {
  logoId: number;
  filePath: string;
}

interface SurveyText {
  surveyTextId: number;
  text: string;
  isStartText: boolean;
}

interface Header {
  filePath?: string;
  id?: number;
}
interface Style {
  urlFavicon: string;
  browserTitle: string;
  buttonsColor: string;
  overlayBoxColor: string;
  urlLogo: string;
  urlRadarChart: string;
  heightLogo: string;
  headerColor: string;
  header: Header;
}
interface Survey {
  idSurvey: number;
  isTemplate: boolean;
  description: string | object;
  locale: string;
  name: string;
  title: string;
  showTitle: boolean;
  pages: object[];
  projectId: number;
  subGroup: string;
  logo: Logo;
  startText: SurveyText;
  finalText: SurveyText;
  style: Style;
  // completedHtml: SurveyText;
}

interface Access {
  accessId: number;
  isLocked: boolean;
  segments: string[];
  survey: Survey;
}

interface Result {
  accessId: number | undefined;
  surveyId: number | undefined;
  testMode: boolean;
  questionResults: QuestionResult[];
  currentPageNo: number;
  isCompleted: boolean;
}

interface QuestionResult {
  questionId: number;
  questionText: string;
  questionType: string;
  value: string;
  score?: number;
  matrixTitle?: string;
  matrixId?: number;
  alternativeId?: number;
}

let surveysTso = [60];
let campaign = 'QJEYK';
if (
  process &&
  process.env &&
  process.env.NODE_ENV &&
  process.env.NODE_ENV === 'development'
) {
  surveysTso = [59];
  campaign = 'QDGPP';
}
// const surveysTsoList = [59, 60, 61, 62, 64];
const surveysSpiritHoch3List = [55, 53, 56];

const Survey: React.FC = () => {
  // „Was? Du willst uns schon verlassen? Bleib´ dran, es kommen noch interessante Fragen 😊“
  const query = useQuery();
  const { addToast } = useToast();
  // const position = useMousePosition();

  const [access, setAccess] = useState<Access>();
  const [surveyVisible, setSurveyVisible] = useState(false);
  const { params } = useRouteMatch<SurveyParams>();
  const [localStorageName] = useState<string>(
    params.code
      ? `@Victor:results-${params.accessId}-${params.code}`
      : `@Victor:results-${params.accessId}`,
  );
  const [loadData, setLoadData] = useState<any>();
  const [currentPageNo, setCurrentPageNo] = useState<number>();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showChart, setShowChart] = useState<string | null>();
  const [showOverlay, setShowOverlay] = useState(false);
  const [returnedResultId, setReturnedResultId] = useState(0);
  const [returnedSurveyId, setReturnedSurveyId] = useState(0);
  const [returnedCode, setReturnedCode] = useState('');
  const [backgroundColor, setBackGroundColor] = useState('');
  const [buttonColor, setButtonColor] = useState('');
  const [headerColor, setHeaderColor] = useState('');
  const [heightLogo, setHeightLogo] = useState('');
  const [urlRadarChart, setUrlRadarChart] = useState('');
  const [urlHeaderImage, setUrlHeaderImage] = useState('');
  const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentPageAnswering, setCurrentPageAnswering] = useState(1);

  // Change the results before save it in the database
  const modifySurveyResults = useCallback(
    (survey: { data: any; getQuestionByValueName: (arg0: string) => any }) => {
      const resultData: QuestionResult[] = [];

      for (const key in survey.data) {
        const question = survey.getQuestionByValueName(key);
        if (question) {
          if (!question.hasRows) {
            const item: QuestionResult = {
              questionId: parseInt(question.questionId, 10),
              questionText: question.title,
              questionType: question.internalType.replace(/\s/g, ''),
              value: question.value === 'none' ? -99 : question.value,
              score:
                question.internalType === EnumQuestionType.Scale &&
                question.value !== 'none'
                  ? (question.choices.length - question.value) * 25
                  : -99,
            };

            resultData.push(item);
          } else {
            question.rows.forEach((row: any) => {
              if (question.value[row.value]) {
                const item: QuestionResult = {
                  questionId: parseInt(row.value, 10),
                  questionText: row.text,
                  questionType: EnumQuestionType.Scale,
                  matrixTitle: question.title,
                  matrixId: question.matrixId,
                  alternativeId: row.value,
                  value:
                    question.value[row.value] === 'none'
                      ? -99
                      : question.value[row.value],
                  score:
                    question.value !== 'none'
                      ? (question.columns.length - question.value[row.value]) *
                        25
                      : -99,
                };

                resultData.push(item);
              }
            });
          }
        }
      }

      return resultData;
    },
    [],
  );

  // Fetch the result in the database and return in the format to be loaded in surveyjs
  const modifyStoredResults = useCallback(
    (questionResults: QuestionResult[]) => {
      const mountLoadData: any = {};

      questionResults.forEach((questionResult: QuestionResult) => {
        if (questionResult.matrixTitle) {
          if (questionResult.alternativeId) {
            if (mountLoadData[questionResult.matrixTitle]) {
              mountLoadData[questionResult.matrixTitle] = {
                ...mountLoadData[questionResult.matrixTitle],
                [questionResult.alternativeId]: questionResult.value,
              };
            } else {
              mountLoadData[questionResult.matrixTitle] = {
                [questionResult.alternativeId]: questionResult.value,
              };
            }
          }
        } else
          mountLoadData[questionResult.questionText] = questionResult.value;
      });

      return mountLoadData;
    },
    [],
  );

  useLayoutEffect(() => {
    const favicon2 = document.getElementById('favicon');
    const prefix = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    /// FAVICON
    if (access?.survey?.style && access?.survey.style.urlFavicon) {
      favicon2?.setAttribute('href', access?.survey.style.urlFavicon);
    } else {
      favicon2?.setAttribute(
        'href',
        `${prefix}://${window.location.host}/favicon3.ico`,
      );
    }

    /// BROWSERTITLE
    if (access?.survey?.style && access?.survey.style.browserTitle) {
      document.title = access?.survey.style.browserTitle ?? '...';
    } else {
      document.title = access?.survey.name ?? '...';
    }

    /// BACKGROUNDCLOR
    if (access?.survey?.style && access?.survey.style.overlayBoxColor) {
      setBackGroundColor(`${access?.survey.style.overlayBoxColor}f2`);
    } else {
      setBackGroundColor('rgb(255, 120, 12, 0.9)');
    }

    /// BUTTONCOLOR
    if (access?.survey?.style && access?.survey.style.buttonsColor) {
      setButtonColor(access?.survey.style.buttonsColor);
    } else {
      setButtonColor('#1AB394');
    }

    /// HEADERCOLOR
    if (access?.survey?.style && access?.survey.style.headerColor) {
      setHeaderColor(access?.survey.style.headerColor);
    } else {
      setHeaderColor('#e0e0e0');
    }

    /// SIZE LOGO
    if (access?.survey?.style && access?.survey.style.heightLogo) {
      setHeightLogo(access?.survey.style.heightLogo);
    } else {
      setHeightLogo('100%');
    }

    /// SIZE LOGO
    if (
      access?.survey?.style &&
      access?.survey.style.header &&
      access?.survey.style.header.filePath
    ) {
      setUrlHeaderImage(access?.survey.style?.header.filePath);
    } else {
      setUrlHeaderImage('');
    }

    /// pathRadarChart
    if (access?.survey?.style && access?.survey.style.urlRadarChart) {
      setUrlRadarChart(access?.survey.style.urlRadarChart);
    } else {
      setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
    }
  }, [access?.survey.name, access?.survey.style]);

  useEffect(() => {
    api.get(`/accesses/${params.accessId}/full`).then(response => {
      const formattedPages: any[] = [];
      setReturnedSurveyId(response.data.survey.surveyId);

      if (
        response.data &&
        response.data.survey &&
        response.data.survey.startText &&
        response.data.placeholders
      ) {
        response.data.placeholders.forEach((placeholder: any) => {
          const replace = `${placeholder.searchValue}`;
          const regexReplace = new RegExp(replace, 'g');
          response.data.survey.startText.text =
            response.data.survey.startText.text.replace(
              regexReplace,
              placeholder.replaceValue,
            );
        });
      }

      if (
        response.data &&
        response.data.survey &&
        response.data.survey.completedHtml &&
        response.data.placeholders
      ) {
        response.data.placeholders.forEach((placeholder: any) => {
          const replace = `${placeholder.searchValue}`;
          const regexReplace = new RegExp(replace, 'g');
          response.data.survey.completedHtml =
            response.data.survey.completedHtml.replace(
              regexReplace,
              placeholder.replaceValue,
            );
        });
      }

      response.data?.survey?.pages.map((page: any) => {
        const customPages: any[] = [];
        let elementsPerPage: any[] = [];
        page.elements.map((element: any, index: number) => {
          if (response.data.placeholders) {
            response.data.placeholders.forEach((placeholder: any) => {
              if (element.type === 'matrix') {
                element?.rows?.map((x: any) => {
                  const y = x;
                  const replace = `${placeholder.searchValue}`;
                  const regexReplace = new RegExp(replace, 'g');
                  y.text = x.text.replace(
                    regexReplace,
                    placeholder.replaceValue,
                  );
                  return y;
                });

                element?.columns?.map((x: any) => {
                  const y = x;
                  const replace = `${placeholder.searchValue}`;
                  const regexReplace = new RegExp(replace, 'g');
                  y.text = x.text.replace(
                    regexReplace,
                    placeholder.replaceValue,
                  );
                  return y;
                });
              }

              if (element.type === 'html') {
                const htmlPlaceHolder = element;
                const replace = `${placeholder.searchValue}`;
                const regexReplace = new RegExp(replace, 'g');
                htmlPlaceHolder.html = element?.html?.replace(
                  regexReplace,
                  placeholder.replaceValue,
                );
              }

              const questionTitlePlaceHolder = element;
              const replace = `${placeholder.searchValue}`;
              const regexReplace = new RegExp(replace, 'g');
              questionTitlePlaceHolder.title = element?.title?.replace(
                regexReplace,
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
                    regexReplace,
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

      const survey = {
        ...response.data.survey,
        idSurvey: response.data.survey.surveyId,
        pages: formattedPagesWithoudElementIds,
      };
      delete survey.surveyId;
      const questionnaire = { ...response.data, survey };

      if (questionnaire.isLocked) setAlertMessage(accessLockedMessage);

      setAccess(questionnaire);
    });
  }, [params.accessId]);

  // Checks if the code is being passed by parameter and, if the code exists, retrieves the results
  useEffect(() => {
    const resultsFromStorage = JSON.parse(
      localStorage.getItem(localStorageName) ?? '{}',
    );

    if (params.code) {
      api.get(`/results/${params.code}`).then(response => {
        if (response.data) {
          const modifiedStoredResults = modifyStoredResults(
            response.data.questionResults,
          );

          setCurrentPageNo(response.data.currentPageNo);
          setLoadData(modifiedStoredResults);

          localStorage.setItem(
            localStorageName,
            JSON.stringify({
              resultId: response.data.resultId,
              code: response.data.code,
              currentPageNo: response.data.currentPageNo,
              data: modifiedStoredResults,
              isCompleted: response.data.isCompleted,
            }),
          );

          if (response.data.isCompleted)
            setAlertMessage(surveyCompletedMessage);
        } else setAlertMessage(codeDontExistsMessage);
      });
    }
    // If access has not been made by a code, load the survey from the local storage
    else {
      setCurrentPageNo(resultsFromStorage.currentPageNo);
      setLoadData(resultsFromStorage.data);

      if (resultsFromStorage.isCompleted)
        setAlertMessage(surveyCompletedMessage);
    }
  }, [params.code, modifyStoredResults, localStorageName]);

  const handleStartSurvey = useCallback(() => {
    setSurveyVisible(true);
  }, []);

  const saveResult = useCallback(
    async (surveyResult: any, isCompleted: boolean): Promise<any> => {
      const result: Result = {
        accessId: access?.accessId,
        surveyId: access?.survey.idSurvey,
        testMode: query.get('test') === 'true',
        questionResults: [],
        currentPageNo: surveyResult.currentPageNo + 1,
        isCompleted,
      };

      result.questionResults = modifySurveyResults(surveyResult);

      const resultsFromStorage = JSON.parse(
        localStorage.getItem(localStorageName) ?? '{}',
      );

      if (resultsFromStorage.resultId > 0) {
        await api.put(`/results/${resultsFromStorage.resultId}`, result);
        return {
          resultId: resultsFromStorage.resultId,
          code: resultsFromStorage.code,
        };
      }

      const resultSaved = await api.post('/results', result);

      return {
        resultId: resultSaved.data.resultId,
        code: resultSaved.data.code,
      };
    },
    [
      access?.accessId,
      access?.survey.idSurvey,
      localStorageName,
      modifySurveyResults,
      query,
    ],
  );

  const handlePartialSend = useCallback(
    async (surveyResult: any) => {
      try {
        setCurrentPageAnswering(count => count + 1);
        window.scrollTo(0, 0);
        if (!access?.survey.isTemplate) {
          const { resultId, code } = await saveResult(surveyResult, false);

          setReturnedCode(code);
          localStorage.setItem(
            localStorageName,
            JSON.stringify({
              resultId,
              code,
              currentPageNo: surveyResult.currentPageNo,
              data: surveyResult.data,
              isCompleted: false,
            }),
          );
        }
      } catch (error) {
        console.log('Error: ', error);
        const localStorageData = JSON.parse(
          localStorage.getItem(localStorageName) ?? '{}',
        );
        api.post(`/results/exceptionUpdate`, {
          error,
          code: params.code ?? 'default link',
          access: access?.accessId,
          resultData: surveyResult?.data,
          localStorageData,
        });
        addToast({
          type: 'error',
          title: 'Error Saving',
          description:
            'An error occurred while saving the results, please try again.',
        });
      }
    },
    [
      access?.survey.isTemplate,
      access?.accessId,
      saveResult,
      localStorageName,
      params.code,
      addToast,
    ],
  );

  const handleComplete = useCallback(
    async (surveyResult: any) => {
      try {
        if (!access?.survey.isTemplate) {
          // const result = await saveResult(surveyResult, true);

          const { resultId, code } = await saveResult(surveyResult, true);

          setReturnedCode(code);

          localStorage.removeItem(localStorageName);

          setShowFinalMessage(true);

          if (query.get('chart') && resultId > 0) {
            setShowOverlay(true);
            setShowFinalMessage(false);
            setShowChart(query.get('chart'));
            setReturnedResultId(resultId);
          }

          if (query.get('radar') && resultId > 0) {
            setShowOverlay(true);
            setShowFinalMessage(false);
            setShowChart(EnumChartType.Radar);
            setReturnedResultId(resultId);
          }
        }
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Error Saving',
          description:
            'An error occurred while saving the results, please try again.',
        });
      }
    },
    [addToast, access?.survey.isTemplate, saveResult, localStorageName, query],
  );

  // useEffect(() => {
  //   if (currentPageNo !== undefined) setCurrentPageAnswering(currentPageNo + 1);

  //   const showMessagePageLimit = 0.6 * (access?.survey?.pages?.length ?? 1);

  //   if (
  //     (!!access?.survey.startText?.text &&
  //       surveyVisible &&
  //       currentPageAnswering < showMessagePageLimit &&
  //       position.y < 80) ||
  //     (!access?.survey.startText?.text &&
  //       !surveyVisible &&
  //       currentPageAnswering < showMessagePageLimit &&
  //       position.y < 80)
  //   ) {
  //     setModalIsOpen(true);
  //   } else {
  //     setModalIsOpen(false);
  //   }
  // }, [access, currentPageAnswering, currentPageNo, position.y, surveyVisible]);

  return (
    <>
      {urlHeaderImage !== '' ? (
        <HeaderImage
          useStyle={true}
          headerColor={headerColor}
          sizeLogo={heightLogo}
        >
          <img
            className="backgroundHeader"
            src={urlHeaderImage ?? ''}
            alt="Logo - Survey"
          />{' '}
          <div>
            <img
              src={access?.survey.logo?.filePath ?? ''}
              alt="Logo - Survey"
            />
          </div>
        </HeaderImage>
      ) : (
        <Header useStyle={true} headerColor={headerColor} sizeLogo={heightLogo}>
          {' '}
          <img src={access?.survey.logo?.filePath ?? ''} alt="Logo - Survey" />
        </Header>
      )}

      <Container
        useStyle={true}
        mainColor={buttonColor}
        showFinalMessage={showFinalMessage}
      >
        <div>{showChart}</div>
        {alertMessage === '' ? (
          access?.survey.startText?.text &&
          !surveyVisible &&
          (!currentPageNo || currentPageNo === 0) ? (
            <StartPage
              text={access?.survey.startText.text}
              onStartButtonClick={handleStartSurvey}
              logoPath={access?.survey.logo?.filePath ?? ''}
              surveyName={access?.survey.title}
              buttonColor={buttonColor}
            />
          ) : (
            <>
              {/* {position.y < 80 && (!currentPageNo || currentPageNo < 3) ? (
                <AlertMessage>{`„Was? Du willst uns schon verlassen? Bleib´ dran, es kommen noch interessante Fragen 😊“`}</AlertMessage>
              ) : ( */}
              {/* <Modal show={modalIsOpen} modalTitle={``}>
                <AlertMessageLeaving>{`„Was? Du willst uns schon verlassen? Bleib´ dran, es kommen noch interessante Fragen 😊“`}</AlertMessageLeaving>
              </Modal> */}
              <SurveyPage
                model={access?.survey}
                onPartialSend={handlePartialSend}
                onComplete={handleComplete}
                segments={access?.segments}
                currentPageNo={currentPageNo}
                data={loadData}
              />
              {/* )} */}
            </>
          )
        ) : (
          <AlertMessage>
            <FiAlertTriangle size={40} />
            <br />
            {alertMessage}
            <p>
              Es liegt ein Fehler vor? Dann melden Sie sich bitte bei
              office@emotion-banking.at
            </p>
          </AlertMessage>
        )}

        {showChart && (
          <div id="chartArea">
            {showChart === EnumChartType.BubbleTree && (
              <BubbleTreeContainer
                surveyId={returnedSurveyId}
                resultId={returnedResultId}
              />
            )}

            {showChart === EnumChartType.Radar && (
              <RadarContainer
                surveyId={returnedSurveyId}
                resultId={returnedResultId}
                // Todo: create a page to associate the radar background for a specific a-pillar, today is hard coded
                pinkBackground={surveysSpiritHoch3List.some(
                  surveyId => surveyId === access?.survey.idSurvey,
                )}
                // urlRadarChart={'/static/media/bg-radar-chart-pink.9da4933a.png'}
              />
            )}

            {showOverlay && (
              <OverlayBox
                campaignNewsletter={
                  surveysTso.includes(returnedSurveyId) ? campaign : ''
                }
                resultId={returnedResultId}
                code={returnedCode}
                setShowOverlay={setShowOverlay}
                htmlIdToScroll={'chartArea'}
                {...{ backgroundColor: `${backgroundColor}` }}
              />
            )}
          </div>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Survey;
