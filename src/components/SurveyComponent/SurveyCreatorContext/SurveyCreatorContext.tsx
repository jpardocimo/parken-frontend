/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */

/* eslint-disable no-self-compare */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-multi-str */

/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ChangeEvent,
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// import 'jquery-bar-rating/jquery.barrating.js';
import '../SurveyCustomWidgets/eb-barrating.js';
import { Tab, Tabs } from '@material-ui/core';
import 'font-awesome/css/font-awesome.css';
import '../SurveyCustomWidgets/styles/bootstrap-stars.css';
import '../SurveyCustomWidgets/styles/css-stars.css';
import '../SurveyCustomWidgets/styles/fontawesome-stars.css';
import '../SurveyCustomWidgets/styles/fontawesome-stars-o.css';
import '../SurveyCustomWidgets/styles/bars-1to10.css';
import '../SurveyCustomWidgets/styles/bars-movie.css';
import '../SurveyCustomWidgets/styles/bars-square.css';
import '../SurveyCustomWidgets/styles/bars-pill.css';
import '../SurveyCustomWidgets/styles/bars-reversed.css';
import '../SurveyCustomWidgets/styles/bars-horizontal.css';
import '../SurveyCustomWidgets/styles/eb-emotions.css';

import 'jquery-ui-dist/jquery-ui.css';

import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';
import 'nouislider/dist/nouislider.min.css';
import 'icheck/skins/square/blue.css';
import 'survey-creator/survey-creator.css';
import 'survey-knockout/survey.css';

import $ from 'jquery';
import * as SurveyKo from 'survey-knockout';
import * as SurveyJSCreator from 'survey-creator';
import * as widgets from 'surveyjs-widgets';
import './styles.css';
// import SortableTree from '@nosferatu500/react-sortable-tree';
import { SurveyCreatorConfig } from './SurveyCreatorConfig';
import { CustomCheckBox } from './CustomCheckboxSegments';

(window as any).$ = (window as any).jQuery = $;
require('icheck');
// require('emotion-ratings/dist/emotion-ratings.js');

interface Access {
  segments: string[];
  name: string;
  accessId: number;
}

interface SurveyCreatorContextData {
  surveyCreator: SurveyJSCreator.SurveyCreator | undefined;
}

interface SurveyCreatorProviderProps {
  children: ReactNode;
  surveyText: string;
  callbackSaveSurvey: (text: string) => void;
  accesses: Access[];

  surveyId: number | undefined;
  isLocked: boolean;
}

export const SurveyCreatorContext = createContext<SurveyCreatorContextData>(
  {} as SurveyCreatorContextData,
);

SurveyCreatorConfig(SurveyKo, SurveyJSCreator, widgets);

export function SurveyProvider({
  children,
  surveyText,
  callbackSaveSurvey,
  accesses,
  surveyId,
  isLocked,
}: SurveyCreatorProviderProps): ReactElement {
  const [surveyCreator, setSurveyCreator] =
    useState<SurveyJSCreator.SurveyCreator>();
  // const [surveyElementsTest, setSurveyElementsTest] = useState<string>('');

  // const [skeletonFromSurvey, setSkeletonFromSurvey] = useState<any>();
  // const childRef = useRef<any>();

  const renderQuestionInDesigner = useCallback((survey, options) => {
    // createButtonForPopup(options, false);

    options.question.registerFunctionOnPropertyValueChanged(
      'orderChoices',
      function (newValue: any) {
        if (newValue === 'asc value') {
          options.question.choices = options.question?.choices?.sort(
            (a: any, b: any) => {
              if (a.value < b.value) return -1;
              return a.value > b.value ? 1 : 0;
            },
          );
        } else {
          options.question.choices = options.question?.choices?.sort(
            (a: any, b: any) => {
              if (a.value > b.value) return -1;
              return a.value < b.value ? 1 : 0;
            },
          );
        }

        const parent = options.question;
        if (parent.getType() === 'ebslider' || parent.getType() === 'ranking') {
          if (parent.updateRankingChoices) {
            parent.updateRankingChoices();
          } else {
            parent.updateRanking();
          }
        } else if (parent.updateVisibleChoices) {
          parent.updateVisibleChoices();
        }
      },
    );
  }, []);

  // load the survey creator
  useEffect(() => {
    const creatorOptions = {
      readOnly: isLocked,
      showState: true,
      isAutoSave: true,
      showToolbox: 'right',
      showPropertyGrid: 'right',
      // showSurveyTitle: 'always',
      // pageEditMode: 'single',
      allowAddToToolbox: false,
      allowModifyPages: false,
      showPagesToolbox: false,
      showJSONEditorTab: true,
      allowCopy: false,

      allowDragging: false,
      allowControlSurveyTitleVisibility: true,
      questionTypes: [
        'pagebreak',
        'html',
        'text',
        'comment',
        'radiogroup',
        'rating',
        'dropdown',
        'ebslider',
        'ebemotionsratings',
        'barrating',
        'ranking',
        'checkbox',
        'image',
      ],
    };

    const propertyStopList = [
      'bindings',
      'rangeName',
      'start',
      'step',
      'rangeMin',
      'rangeMax',
      'pipsMode',
      'pipsValues',
      'pipsText',
      'pipsDensity',
      'orientation',
      'direction',
      'rateValues',
      'rateMin',
      'rateMax',
      'rateStep',
      'displayRateDescriptionsAsExtremeItems',
      'defaultValueExpression',
      'rowsVisibleIf',
      'minValueExpression',
      'maxValueExpression',
    ];

    // create a new instance for surveyCreator
    const internalSurveyCreator = new SurveyJSCreator.SurveyCreator(
      null,
      creatorOptions,
    );

    internalSurveyCreator.onElementAllowOperations.add(function (
      editor,
      options,
    ) {
      // enable edit
      options.allowEdit = true;
      // disable delete
      options.allowDelete = true;
      // disable change require
      options.allowChangeRequired = true;
      // disable change show/hide title
      options.allowShowHideTitle = true;
      // disable add to toolbox
      options.allowAddToToolbox = false;
      // disable copying
      options.allowCopy = false;
      // disable changing type
      options.allowChangeType = true;
      // Enable/disable element drag&drop
      options.allowDragging = true;
    });

    internalSurveyCreator.onShowingProperty.add(function (sender, options) {
      options.canShow = propertyStopList.indexOf(options.property.name) === -1;
    });

    internalSurveyCreator.onSurveyInstanceCreated.add(function (
      sender,
      options,
    ) {
      // If we are creating a surface for designer surface
      if (options.reason === 'designer') {
        options.survey.onAfterRenderQuestion.add(renderQuestionInDesigner);
      }
    });

    // toolbox setttings
    internalSurveyCreator.toolbox.removeItem('bootstrapslider');
    internalSurveyCreator.toolbox.removeItem('sortablejs');
    internalSurveyCreator.toolbox.removeItem('sortablelist');

    internalSurveyCreator.text = surveyText;
    // callback function: is called by any change in the survey (properties, toolbox, pages..etc)
    internalSurveyCreator.saveSurveyFunc = (saveNo: any, callback: any) => {
      callbackSaveSurvey(internalSurveyCreator.text);
      callback(saveNo, callbackSaveSurvey);
    };

    // put the new instance of surveyCreator into state
    setSurveyCreator(internalSurveyCreator);
  }, [callbackSaveSurvey, isLocked, renderQuestionInDesigner, surveyText]);

  const refreshQuestionVisibility = useCallback(
    (segmentListAsString: string, questionName: string) => {
      if (surveyCreator) {
        if (segmentListAsString.length > 0) {
          const question1 =
            surveyCreator.survey.getQuestionByName(questionName);
          question1.setPropertyValue(
            'visibleIf',
            `questionWithSegment('${segmentListAsString}')=true`,
          );
        } else {
          const question1 =
            surveyCreator.survey.getQuestionByName(questionName);
          question1.setPropertyValue('visibleIf', ``);
        }
      }
    },
    [surveyCreator],
  );

  const refreshCustomComponentsNames = useCallback(() => {
    if (surveyCreator) {
      surveyCreator?.onQuestionAdded.add(function (sender, options) {
        const q = options.question;

        const t = q.getType();

        const question1 =
          surveyCreator.survey.getQuestionByValueName(`question1`);

        if (question1) {
          switch (t) {
            case 'image':
              question1.name = `image_${q.id}`;
              break;
            case 'pagebreak':
              question1.name = `pagebreak_${q.id}`;
              break;
            case 'html' || 'htmlElement':
              question1.name = `html_${q.id}`;
              question1.html =
                '<p style="font-size: 20px; font-family: Raleway; font-weight: 700">Hier der gewünschte Text</p>';
              break;

            default:
              break;
          }
        }
      });
    }
  }, [surveyCreator]);

  // load custm checkbox for segments
  useEffect(() => {
    if (surveyCreator) {
      surveyCreator.onSetPropertyEditorOptions.add(function (editor, options) {
        // Hide Add/Remove/Clear buttons and the entry type tab for "choices" property for all "checkbox"  questions.
        if (options.propertyName === 'choices') {
          options.editorOptions.allowAddRemoveItems = false;
          options.editorOptions.showTextView = true;
        }
      });
    }

    const customCheckbox = CustomCheckBox(
      SurveyKo,
      accesses,
      SurveyJSCreator,
      refreshCustomComponentsNames,
      refreshQuestionVisibility,
    );
  }, [
    accesses,
    refreshCustomComponentsNames,
    refreshQuestionVisibility,
    surveyCreator,
  ]);

  return (
    <>
      <div>
        <SurveyCreatorContext.Provider value={{ surveyCreator }}>
          {children}
        </SurveyCreatorContext.Provider>
      </div>
    </>
  );
}
