/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab, Tabs } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { Lock, LockOpen } from '@material-ui/icons';
import api from '../../../services/api';

import getEncodedSurvey from '../../../utils/getEncodedSurvey';
import getDecodedSurvey from '../../../utils/getDecodedSurvey';

import Button from '../../../components/Button';
import SpinnerThreeDots from '../../../components/LoadingSpinner/SpinnerThreeDots';

import { Container, TitleLockedIcon, ButtonLock } from './styles';
import { useToast } from '../../../hooks/toast';
import SortTree from '../../../components/Skeleton';
import { SurveyProvider } from '../../../components/SurveyComponent/SurveyCreatorContext/SurveyCreatorContext';
import SurveyCreatorRenderComponent from '../../../components/SurveyComponent/SurveyCreatorContext/SurveyCreatorRenderComponent';
import getSkeletonFromSurvey from '../../../utils/getSkeletonFromSurvey';
import getSurveyFromSkeleton from '../../../utils/getSurveyFromSkeleton';
import EnumProductSubGroup from '../../../utils/enums/EnumProductSubGroup';

interface Access {
  segments: string[];
  name: string;
  accessId: number;
}

interface Page {
  elements: Element[];
}

interface Element {
  id: number;
  idSubRow: string;
  isAlternative: boolean;
  questionId: number;
  name: string;
  title: string;
  type: any;
  choices?: Choice[];
  rows?: any;
  columns?: any;
}

interface Survey {
  idSurvey: number;
  name: string;
  title: string;
  showTitle: boolean;
  description: string;
  type?: string;
  isTemplate: boolean;
  startTextId: number;
  finalTextId: number;
  projectId: number;
  productId: number;
  logo: Logo;
  pages: Page[];
  accesses: Access[];
  subGroup: any;
  style: any;
}

interface Choice {
  valueRate?: number;
  text: string;
}

interface Logo {
  id: number;
  filePath: string;
}

interface Skeleton {
  surveyId: string;
  skeletonTree: any;
}

const SurveyPageEdit: React.FC = () => {
  const switchRef = useRef(null);
  const { addToast } = useToast();
  const surveyIdParam: { surveyId: string } = useParams();

  const [survey, setSurvey] = useState<Survey>();
  const [selectedTab, setSelectedTab] = useState<string>('surveyCreator');
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [skeleton, setSkeleton] = useState<Skeleton>();
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [surveyCreatorText, setSurveyCreatorText] = useState<string>(
    JSON.stringify({
      title: '',
      isTemplate: false,
      pages: [{ name: 'page1', elements: [] }],
    }),
  );

  const loadSurveyFromDatabase = useCallback(() => {
    api
      .get(`/surveys/${surveyIdParam.surveyId}`, {
        params: {
          surveyId: surveyIdParam.surveyId,
        },
      })
      .then(response => {
        const jsonFromDb = {
          idSurvey: response.data.surveyId,
          pages: response.data.pages,
          description: response.data.description,
          name: response.data.name,
          title: response.data.title,
          showTitle: response.data?.showTitle,
          isTemplate: response.data.isTemplate,
          logo: response.data.logo,
          subGroup: response.data.subGroup,
          projectId: response.data.projectId,
          productId: response.data.productId,
          startTextId: response.data.startTextId,
          finalTextId: response.data.finalTextId,
          accesses: response.data.accessess,
          style: response.data.style,
        };

        let strSubGroup = '';

        switch (jsonFromDb.subGroup) {
          case 'Employees':
            strSubGroup = EnumProductSubGroup.Employees;
            break;
          case 'Management':
            strSubGroup = EnumProductSubGroup.Management;
            break;
          case 'Corporate':
            strSubGroup = EnumProductSubGroup.Corporate;
            break;
          case 'Retail':
            strSubGroup = EnumProductSubGroup.Retail;
            break;
          case 'Wealthy':
            strSubGroup = EnumProductSubGroup.Wealthy;
            break;
          default:
            break;
        }

        if (jsonFromDb.isTemplate) {
          setPageTitle(`${jsonFromDb.name}`);
        } else {
          const { projectName } = response.data;
          setPageTitle(`${projectName} - ${jsonFromDb.name} - ${strSubGroup}`);
        }

        if (response.data.isLocked) {
          setIsLocked(response.data.isLocked);
        }

        const decodedSurvey = getDecodedSurvey(jsonFromDb);

        // Please, don't remove this conversion. decodedSurvey has "[[Prototype]]" field,
        // so to remove it, need to stringify it and then apply the JSON.parse
        const surveyJsonConversion = JSON.stringify(decodedSurvey);

        setSurvey(JSON.parse(surveyJsonConversion));
        // await getSkeletonFromDatabase(JSON.parse(surveyJsonConversion));
        setSurveyCreatorText(JSON.stringify(decodedSurvey));

        if (jsonFromDb) {
          api
            .get(`/accesses/survey/${jsonFromDb.idSurvey}`, {
              params: {
                surveyId: jsonFromDb.idSurvey,
              },
            })
            .then(resp => {
              setAccesses(resp.data);
            });
        }
      });
  }, [surveyIdParam.surveyId]);

  const handleSetSelectedTab = useCallback(
    async (event: ChangeEvent<any>, newValue: string): Promise<void> => {
      let localSurvey = {};
      if (newValue === 'skeleton') {
        // const treeDataLocal = getSkeletonFromSurvey(
        //   JSON.stringify(localSurvey),
        // );
        // setSkeleton(treeDataLocal);
        await api
          .get(`/surveys/${surveyIdParam.surveyId}`, {
            params: {
              surveyId: surveyIdParam.surveyId,
            },
          })
          .then(response => {
            const jsonFromDb = {
              surveyId: response.data.surveyId,
              pages: response.data.pages,
              description: response.data.description,
              name: response.data.name,
              title: response.data.title,
              isTemplate: response.data.isTemplate,
              logo: response.data.logo,
              subGroup: response.data.subGroup,
              projectId: response.data.projectId,
              productId: response.data.productId,
              startTextId: response.data.startTextId,
              finalTextId: response.data.finalTextId,
              accesses: response.data.accessess,
              style: response.data.style,
            };
            const decodedSurvey = getDecodedSurvey(jsonFromDb);
            const surveyJsonConversion = JSON.stringify(decodedSurvey);
            localSurvey = JSON.parse(surveyJsonConversion);
          })
          .then(() => {
            const treeDataLocal = getSkeletonFromSurvey(
              JSON.stringify(localSurvey),
            );
            setSkeleton(treeDataLocal);
          });
      } else {
        loadSurveyFromDatabase();
        const dataChanged = JSON.parse(
          localStorage.getItem('@Victor:dataChanged') ?? '{}',
        );
        if (dataChanged) {
          if (
            // eslint-disable-next-line no-restricted-globals, no-alert
            !confirm(
              'Changes you made may not be saved. Are you sure do you want to leave?',
            )
          ) {
            // setSelectedTab('skeleton');

            return;
          }
        }

        localStorage.setItem('@Victor:dataChanged', JSON.stringify(false));
      }
      setSelectedTab(newValue);
    },
    [loadSurveyFromDatabase, surveyIdParam.surveyId],
  );

  const callbackSaveSurvey = useCallback(
    async (text: string) => {
      if (!isLocked) {
        try {
          let encodedSurveyTosave;
          if (text !== '' && text) {
            encodedSurveyTosave = getEncodedSurvey(text);
          } else {
            encodedSurveyTosave = getEncodedSurvey(surveyCreatorText);
          }
          encodedSurveyTosave.logo = {
            id: survey?.logo?.id,
            filePath: survey?.logo?.filePath,
          };
          encodedSurveyTosave.startTextId = survey?.startTextId;
          encodedSurveyTosave.finalTextId = survey?.finalTextId;
          encodedSurveyTosave.style = survey?.style;

          encodedSurveyTosave.name =
            encodedSurveyTosave.name ??
            encodedSurveyTosave.title ??
            `survey-${survey?.idSurvey}`;

          const responsePUT = await api.put(
            `/surveys/${survey?.idSurvey}`,
            encodedSurveyTosave,
          );

          if (responsePUT.data === null) {
            addToast({
              type: 'error',
              title: 'Registration Error',
              description:
                'Changes not saved. This survey is locked. Please reload the page to get most recent data.',
            });

            // window.location.reload();
          }
        } catch (err) {
          if (err) {
            addToast({
              type: 'error',
              title: 'Registration Error',
              description: `An error occurred while updating survey, please try again.`,
            });
          }
        }
      } else {
        addToast({
          type: 'error',
          title: 'Registration Error',
          description: `This survey is locked. Your modificantions can not be saved.`,
        });
      }
    },
    [
      isLocked,
      survey?.logo?.id,
      survey?.logo?.filePath,
      survey?.startTextId,
      survey?.finalTextId,
      survey?.style,
      survey?.idSurvey,
      surveyCreatorText,
      addToast,
    ],
  );

  const handleGenerateSurvey = useCallback(() => {
    try {
      api.get(`/skeletons/survey/${survey?.idSurvey}`).then(async response => {
        if (response.data) {
          const surveyElements = getSurveyFromSkeleton(
            response.data?.skeletonTree,
          );

          const surveyLocal: any = survey ?? '';

          surveyLocal.pages[0].elements = surveyElements;

          const stringSurvey = JSON.stringify(surveyLocal);

          await callbackSaveSurvey(stringSurvey);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'Survey generated successfully!',
          });
        }
      });
    } catch (error) {
      console.log('error:', error);
    }
  }, [addToast, callbackSaveSurvey, survey]);

  useEffect(() => {
    loadSurveyFromDatabase();
  }, [loadSurveyFromDatabase]);

  const handleChangeIsLocked = useCallback(() => {
    try {
      api
        .put(`/surveys/${surveyIdParam.surveyId}/setLocked`, {
          isLocked: !isLocked,
        })
        .then(async response => {
          if (response) {
            setIsLocked(!isLocked);
          }
        });
    } catch (error) {
      console.log('error', error);
    }
  }, [isLocked, surveyIdParam]);

  return (
    <Container>
      {selectedTab === 'surveyCreator' && (
        <div style={{ marginTop: 10, marginBottom: 25 }}>
          <header>
            <TitleLockedIcon>
              <h1>{pageTitle}</h1>
            </TitleLockedIcon>

            <ButtonLock>
              {isLocked && <Lock></Lock>}
              {!isLocked && <LockOpen></LockOpen>}
              <Switch
                ref={switchRef}
                checked={isLocked}
                onChange={handleChangeIsLocked}
                color="primary"
              />
            </ButtonLock>
          </header>

          <Link
            to={{
              pathname: `/questions/`,
              state: {
                select: true,
                surveyId: survey?.idSurvey,
                pageTitle,
              },
            }}
          >
            {!isLocked && (
              <Button marginRight="30px" width="150px" height="40px">
                Add Questions
              </Button>
            )}
          </Link>
          <Link
            to={{
              pathname: `/surveys/${survey?.idSurvey}/accesses`,
              state: {
                surveyName: survey?.name,
                subgroup:
                  Object.values(EnumProductSubGroup)[
                    Object.keys(EnumProductSubGroup).indexOf(
                      survey?.subGroup ? survey?.subGroup : '',
                    )
                  ],

                pageTitle,
                isTemplate: survey?.isTemplate,
              },
            }}
          >
            <Button marginRight="35px" width="130px" height="40px">
              Links
            </Button>
          </Link>

          {!survey?.isTemplate && (
            <>
              <Link
                to={{
                  pathname: `/surveyTexts/type/start`,
                  state: {
                    select: true,
                    surveyId: surveyIdParam && surveyIdParam?.surveyId,
                    survey: survey && survey,
                    selectedStartTextId: survey?.startTextId,
                    pageTitle,
                  },
                }}
              >
                <Button marginRight="35px" width="130px" height="40px">
                  Start Text
                </Button>
              </Link>

              <Link
                to={{
                  pathname: `/surveyTexts/type/final`,
                  state: {
                    select: true,
                    surveyId: survey?.idSurvey,
                    survey: survey && survey,
                    selectedFinalTextId: survey?.finalTextId,
                    pageTitle,
                  },
                }}
              >
                <Button marginRight="35px" width="130px" height="40px">
                  Final Text
                </Button>
              </Link>

              <Link
                to={{
                  pathname: `/logos`,
                  state: {
                    select: true,
                    surveyId: surveyIdParam && surveyIdParam?.surveyId,
                    survey: survey && survey,
                    logoId: survey?.logo?.id?.toString(),
                    pageTitle,
                  },
                }}
              >
                <Button marginRight="35px" width="100px" height="40px">
                  Logo
                </Button>
              </Link>

              <Link
                to={{
                  pathname: '/style',
                  state: {
                    surveyId: surveyIdParam && surveyIdParam?.surveyId,
                    survey: survey && survey,
                    pageTitle,
                  },
                }}
              >
                <Button marginRight="35px" width="150px" height="40px">
                  Style
                </Button>
              </Link>

              <Link
                to={{
                  pathname: `/surveys/${survey?.idSurvey}/export`,
                  state: {
                    pageTitle,
                  },
                }}
              >
                <Button marginRight="35px" width="150px" height="40px">
                  Export Results
                </Button>
              </Link>

              {/* <Link to={`/surveys/${survey?.idSurvey}/analytics`}>
                <Button marginRight="35px" width="150px" height="40px">
                  Analytics
                </Button>
              </Link> */}
            </>
          )}

          {survey?.isTemplate && (
            <Link
              to={`/products/surveyTemplate/${survey.idSurvey}`}
              target="_blank"
            >
              <Button
                type="button"
                marginRight="35px"
                width="200px"
                height="40px"
              >
                View Demo
              </Button>
            </Link>
          )}
        </div>
      )}
      {selectedTab === 'skeleton' && (
        <div style={{ marginTop: 10, marginBottom: 33 }}>
          <header>
            <TitleLockedIcon>
              <h1>{pageTitle}</h1>
            </TitleLockedIcon>

            <ButtonLock>
              {isLocked && <Lock></Lock>}
              {!isLocked && <LockOpen></LockOpen>}
              {/* <Switch
                ref={switchRef}
                checked={isLocked}
                onChange={handleChangeIsLocked}
                color="primary"
              /> */}
            </ButtonLock>
          </header>
          <br />
          <br />
        </div>
      )}

      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleSetSelectedTab}
      >
        <Tab value="surveyCreator" label="Survey Creator" />
        <Tab value="skeleton" label="Skeleton" />
      </Tabs>
      {selectedTab === 'skeleton' && (
        <>
          <SpinnerThreeDots loading={true}>
            <SortTree
              surveyId={parseInt(surveyIdParam.surveyId, 10)}
              setSkeleton={setSkeleton}
              treeDataParam={skeleton && skeleton?.skeletonTree}
              handleGenerateSurvey={handleGenerateSurvey}
              surveyIslocked={isLocked}
            ></SortTree>
          </SpinnerThreeDots>
        </>
      )}
      {selectedTab === 'surveyCreator' && (
        <SpinnerThreeDots loading={true}>
          <SurveyProvider
            surveyText={surveyCreatorText}
            callbackSaveSurvey={callbackSaveSurvey}
            accesses={accesses && accesses}
            surveyId={survey?.idSurvey}
            isLocked={isLocked}
          >
            <SurveyCreatorRenderComponent />
          </SurveyProvider>
        </SpinnerThreeDots>
      )}
    </Container>
  );
};

export default SurveyPageEdit;
