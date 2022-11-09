/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */

// import $ from 'jquery';
import emogjiDissatisfiedVery from '../../../assets/emoji_dissatisfied_very.png';
import emogjiDissatisfied from '../../../assets/emoji_dissatisfied.png';
import emogjiNeutral from '../../../assets/emoji_neutral.png';
import emogjiSatisfied from '../../../assets/emoji_satisfied.png';
import emogjiSatisfiedVery from '../../../assets/emoji_satisfied_very.png';
import './eb-emotion-ratings.js';

export const EbEmoticons: any = (SurveyKo: any) => {
  return {
    name: 'ebemotionsratings',
    title: 'Emotions Ratings',
    iconName: 'icon-emotionsratings',
    widgetIsLoaded() {
      return typeof $ == 'function'; // & !!($ as any).ebemotionsratings;
    },
    defaultJSON: {
      choices: [1, 2, 3, 4, 5],
    },
    isFit(question: any) {
      return question.getType() == 'ebemotionsratings';
    },
    isDefaultRender: false,
    htmlTemplate: "<div style='height: 55px'></div>",
    activatedByChanged(activatedBy: any) {
      SurveyKo.JsonObject.metaData.addClass(
        'ebemotionsratings',
        [
          {
            name: 'hasOther',
            visible: false,
          },
          {
            name: 'otherText',
            visible: false,
          },
          {
            name: 'optionsCaption',
            visible: false,
          },
          {
            name: 'otherErrorText',
            visible: false,
          },
          {
            name: 'storeOthersAsComment',
            visible: false,
          },
          {
            name: 'renderAs',
            visible: false,
          },
        ],
        null,
        'dropdown',
      );
      SurveyKo.JsonObject.metaData.addProperties('ebemotionsratings', [
        {
          name: 'emotions:itemvalues',
          category: 'emotions',
          categoryIndex: 1,
          default: [
            emogjiDissatisfiedVery,
            emogjiDissatisfied,
            emogjiNeutral,
            emogjiSatisfied,
            emogjiSatisfiedVery,
          ],
        },
        {
          name: 'emotionSize:number',
          category: 'emotions',
          default: 60,
        },
        {
          name: 'emotionsCount:number',
          category: 'emotions',
          default: 5,
        },
        {
          name: 'bgEmotion',
          category: 'emotions',
          default: emogjiNeutral,
        },
        {
          name: 'emotionColor',
          category: 'emotions',
          default: '#FF0066',
        },
      ]);
    },
    afterRender(question: any, el: any) {
      const emotionsArray = [
        emogjiDissatisfiedVery,
        emogjiDissatisfied,
        emogjiNeutral,
        emogjiSatisfied,
        emogjiSatisfiedVery,
      ];

      const questionSorted = {
        ...question,
        choices: question.choices.sort((a: any, b: any) => {
          if (a.value > b.value) return -1;
          return a.value < b.value ? 1 : 0;
        }),
      };

      const options = {
        bgEmotion: emogjiNeutral,
        emotions: emotionsArray,
        initialRating: question.value,
        color: question.emotionColor,
        count: 5,
        question: questionSorted,
        onUpdate: (value: any) => {
          question.value = value;
        },
      };

      initWidget();
      // question.valueChangedCallback = initWidget;
      question.readOnlyChangedCallback = initWidget;

      function initWidget() {
        el.innerHTML = `<div id="ebemojis"><input id='selectedItem' type='hidden' class='' name='' value='' /></div>`;
        $(el).off();

        (<any>$(el)).find('div').ebemotionsratings(options);
      }
    },
    willUnmount(question: any, el: any) {
      el.innerHTML = null;
      $(el).off();
      question.readOnlyChangedCallback = null;
      question.valueChangedCallback = null;
    },
    pdfQuestionType: 'dropdown',
  };
};
