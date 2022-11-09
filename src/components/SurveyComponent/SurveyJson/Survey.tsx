/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useEffect, useState } from 'react';
// import $ from 'jquery';
import * as Survey from 'survey-react';
// import * as widgets from 'surveyjs-widgets';

import 'survey-react/modern.css';

import '../SurveyCustomWidgets/styles/fontawesome-stars.css';
// import 'emotion-ratings/dist/emotion-ratings.js';

import { EbSlider } from '../SurveyCustomWidgets/EbSlider';
import { EbRating } from '../SurveyCustomWidgets/EbRating';
import { EbStyledRating } from '../SurveyCustomWidgets/EbStyledRating';
import { EbEmoticons } from '../SurveyCustomWidgets/EbEmoticons';
import { ContentSurvey } from './styles';

Survey.StylesManager.applyTheme('modern');

Survey.Serializer.addProperty('question', 'questionId:number');
Survey.Serializer.addProperty('question', 'internalType:string');
Survey.Serializer.addProperty('question', 'matrixId:number');
Survey.Serializer.addProperty('question', {
  name: 'orderChoices:dropdown',
  category: 'general',
  choices: ['asc value', 'desc value'],
});

// widgets.jquerybarrating(Survey, $);
// widgets.emotionsratings(Survey, $);

// Example of adding new locale into the library.
const mycustomSurveyStrings = {
  pagePrevText: 'Zurück',
  pageNextText: 'Weiter',
  completeText: 'Abschicken',
  progressText: 'Seite {0} von {1}',
};

Survey.surveyLocalization.locales.eb = mycustomSurveyStrings;

interface Props {
  model: any;
  onComplete?: Function;
  onValueChanged?: Function;
  onPartialSend?: Function;
  segments?: string[] | undefined;
  currentPageNo?: number;
  data?: object;
}

const customCss = {
  matrix: { root: 'matrixSmallFont' },
};

const SurveyPage: React.FC<Props> = props => {
  const [model, setModel] = useState<Survey.SurveyModel>(
    new Survey.SurveyModel(props.model),
  );

  useEffect(() => {
    const localModel = new Survey.SurveyModel(props.model);
    localModel.showPageTitles = false;
    localModel.currentPageNo = props.currentPageNo ? props.currentPageNo : 0;
    localModel.data = props.data;
    localModel.locale = 'eb';
    localModel.requiredText = '';
    // localModel.completedHtml = '<div></div>';
    // localModel.showCompletedPage = false;
    setModel(localModel);
  }, [props.currentPageNo, props.data, props.model]);

  const questionWithSegment = useCallback(
    (params: string[]) => {
      // this function works only if the question has the sentence bellow, exactlty as is:
      // "visibleIf": "questionWithSegment('Vienna,Baden,Stock Holders' , 'Non Stock Holders') = true",

      // the segments has to be separated by "," and the second parameter is the actual user's segment
      // if this function return true, the question will be hidden
      if (!params) return false;
      const allowedSurveySegments: string[] = params[0]
        .trim()
        .split(',')
        .map(item => item);

      const userSegments = props.segments;

      const shouldShow =
        allowedSurveySegments &&
        allowedSurveySegments.some(item =>
          userSegments?.some(seg => seg === item),
        );

      return shouldShow;
    },
    [props.segments],
  );

  Survey.FunctionFactory.Instance.register(
    'questionWithSegment',
    questionWithSegment,
  );

  Survey.CustomWidgetCollection.Instance.add(EbRating(Survey), 'rating');
  Survey.CustomWidgetCollection.Instance.add(EbSlider(Survey), 'customtype');
  Survey.CustomWidgetCollection.Instance.add(EbEmoticons(Survey), 'customtype');
  Survey.CustomWidgetCollection.Instance.add(
    EbStyledRating(Survey),
    'customtype',
  );

  return (
    <ContentSurvey>
      <Survey.Survey
        model={model}
        onComplete={props.onComplete}
        sendResultOnPageNext={true}
        onPartialSend={props.onPartialSend}
        onValueChanged={props.onValueChanged}
        showProgressBar="top"
        {...(window.innerWidth > 900 ? { css: customCss } : {})}
      />
    </ContentSurvey>
  );
};

export default SurveyPage;
