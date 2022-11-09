/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import $ from 'jquery';

import { PageBreakWidget } from '../SurveyCustomWidgets/PageBreakWidget';
import { EbSlider } from '../SurveyCustomWidgets/EbSlider';
import { EbRating } from '../SurveyCustomWidgets/EbRating';
import { EbStyledRating } from '../SurveyCustomWidgets/EbStyledRating';
import { EbEmoticons } from '../SurveyCustomWidgets/EbEmoticons';
import { EbRadioGroup } from '../SurveyCustomWidgets/EbRadioGroup';

export const SurveyCreatorConfig: any = (
  SurveyKo: any,
  SurveyJSCreator: any,
  widgets: any,
): void => {
  widgets.prettycheckbox(SurveyKo);
  widgets.select2(SurveyKo, $);
  widgets.inputmask(SurveyKo);
  widgets.sortablejs(SurveyKo);
  widgets.ckeditor(SurveyKo);
  widgets.autocomplete(SurveyKo, $);
  widgets.bootstrapslider(SurveyKo);

  SurveyJSCreator.StylesManager.applyTheme('default');

  // remove adorners
  SurveyJSCreator.removeAdorners([
    'choices-label',
    'rating-item',
    'select-choices',
    'choices-draggable',
  ]);

  // questionConverter
  SurveyJSCreator.QuestionConverter.convertInfo = {
    checkbox: ['ranking'],
    ranking: ['checkbox'],
    text: ['comment'],
    comment: ['text'],
    barrating: [
      'radiogroup',
      'dropdown',
      'ebemotionsratings',
      'rating',
      'ebslider',
    ],
    radiogroup: [
      'dropdown',
      'ebemotionsratings',
      'barrating',
      'rating',
      'ebslider',
    ],
    dropdown: [
      'radiogroup',
      'barrating',
      'ebemotionsratings',
      'rating',
      'ebslider',
    ],
    ebemotionsratings: [
      'radiogroup',
      'barrating',
      'dropdown',
      'rating',
      'ebslider',
    ],
    rating: [
      'radiogroup',
      'barrating',
      'dropdown',
      'ebemotionsratings',
      'ebslider',
    ],
    ebslider: [
      'radiogroup',
      'barrating',
      'dropdown',
      'ebemotionsratings',
      'rating',
    ],
  };

  // add new custom properties
  SurveyKo.Serializer.addProperty('survey', {
    name: 'surveyId:number',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('survey', {
    name: 'isTemplate:boolean',
    default: false,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('question', {
    name: 'questionId:string',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('question', {
    name: 'externalId:number',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('question', {
    name: 'matrixId:number',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('question', {
    name: 'internalType:string',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('question', {
    name: 'questionType:string',
    default: 0,
    category: 'general',
  });

  SurveyKo.Serializer.addProperty('matrix', {
    name: 'splitMatrix:switch',
    displayName: 'Split Matrix',
    category: 'general',
    onSetValue(obj: any, value: any) {
      obj.setPropertyValue('splitMatrix', value);
      obj.setPropertyValue(
        'totalOfRows',
        `Total of Rows in this matrix: ${obj?.rows?.length}`,
      );
    },
  });

  SurveyKo.Serializer.addProperty('matrix', {
    name: 'totalOfRows:string',
    displayName: 'Total of Rows',
    dependsOn: ['splitMatrix'],
    readOnly: true,
    category: 'general',
    visibleIf(obj: { splitMatrix: boolean }) {
      if (obj.splitMatrix) {
        return true;
      }
      return false;
    },
  });

  SurveyKo.Serializer.addProperty('matrix', {
    name: 'numberOfRowsToSplit:number',
    displayName: 'Split matrix after (number of rows):',
    default: () => {
      return 10;
    },
    maxValue: 10,
    minValue: 2,
    category: 'general',
    dependsOn: ['splitMatrix'],
    visibleIf(obj: { splitMatrix: boolean }) {
      if (obj.splitMatrix) {
        return true;
      }
      return false;
    },
    onSetValue(obj: any, value: any) {
      let valueToSet = 1;
      obj.setPropertyValue('numberOfRowsToSplit', value);

      valueToSet = value !== 0 ? Math.ceil(obj.rows.length / value) : 0;

      obj.setPropertyValue('numberOfGroups', valueToSet);

      if (valueToSet - 1 < obj.numberOfGroupsToInsertPageBreakAfter) {
        obj.setPropertyValue(
          'numberOfGroupsToInsertPageBreakAfter',
          valueToSet - 1,
        );
      }
    },
  });

  SurveyKo.Serializer.addProperty('matrix', {
    name: 'numberOfGroups:number',
    displayName: 'Number of row groups that will be generated:',
    default: 10,
    maxValue: 10,
    minValue: 2,
    readOnly: true,
    category: 'general',
    dependsOn: ['numberOfRowsToSplit', 'splitMatrix'],
    visibleIf(obj: { splitMatrix: boolean }) {
      if (obj.splitMatrix) {
        return true;
      }
      return false;
    },
  });

  SurveyKo.Serializer.addProperty('matrix', {
    name: 'numberOfGroupsToInsertPageBreakAfter:number',
    displayName: `Insert the number of groups (splitted) to insert a page break after. Value "0": no page breaks.`,
    default: 0,
    maxValue: 100,
    minValue: 0,
    category: 'general',
    dependsOn: ['splitMatrix', 'numberOfGroups'],
    visibleIf(obj: { splitMatrix: boolean }) {
      if (obj.splitMatrix) {
        return true;
      }
      return false;
    },
    onSetValue(obj: any, value: any) {
      if (obj.numberOfGroups - 1 < value) {
        obj.setPropertyValue(
          'numberOfGroupsToInsertPageBreakAfter',
          obj.numberOfGroups - 1,
        );
      } else {
        obj.setPropertyValue('numberOfGroupsToInsertPageBreakAfter', value);
      }
    },
  });

  // SurveyKo.Serializer.addProperty('question', {
  //   name: 'popupDescription:text',
  //   category: 'general',
  //   // visibleIndex: 1,
  // });

  SurveyKo.Serializer.addProperty('question', {
    name: 'orderChoices:dropdown',
    category: 'general',
    choices: ['asc value', 'desc value'],
  });

  SurveyKo.CustomWidgetCollection.Instance.add(
    PageBreakWidget(SurveyKo),
    'customtype',
  );

  SurveyKo.CustomWidgetCollection.Instance.add(
    EbSlider(SurveyKo),
    'customtype',
  );

  SurveyKo.CustomWidgetCollection.Instance.add(
    EbStyledRating(SurveyKo),
    'customtype',
  );

  SurveyKo.CustomWidgetCollection.Instance.add(
    EbEmoticons(SurveyKo),
    'customtype',
  );

  SurveyKo.CustomWidgetCollection.Instance.add(
    EbRadioGroup(SurveyKo),
    'radiogroup',
  );

  SurveyKo.CustomWidgetCollection.Instance.add(EbRating(SurveyKo), 'rating');

  // configure custom properties
  SurveyKo.Serializer.findProperty('survey', 'isTemplate').visible = false;
  SurveyKo.Serializer.findProperty('survey', 'surveyId').visible = false;
  SurveyKo.Serializer.findProperty('question', 'name').readOnly = true;
  SurveyKo.Serializer.findProperty('question', 'questionId').visible = false;
  SurveyKo.Serializer.findProperty('question', 'externalId').visible = false;
  SurveyKo.Serializer.findProperty('question', 'matrixId').visible = false;
  SurveyKo.Serializer.findProperty('question', 'internalType').visible = false;
  SurveyKo.Serializer.findProperty('question', 'questionType').visible = false;
  SurveyKo.Serializer.findProperty('question', 'enableIf').visible = false;
  SurveyKo.Serializer.findProperty('matrix', 'validators').visible = false;

  SurveyKo.Serializer.findProperty('itemvalue', 'value').readOnly = true;
  SurveyKo.Serializer.findProperty('page', [
    { name: 'visible', default: true },
  ]);

  SurveyKo.Serializer.findProperty('page', 'visible').readOnly = true;
  SurveyKo.Serializer.findProperty('page', 'readOnly').readOnly = true;
  SurveyKo.Serializer.findProperty('page', 'readOnly').visible = false;
  SurveyKo.Serializer.findProperty('page', 'visibleIf').visible = false;
  SurveyKo.Serializer.findProperty('page', 'enableIf').visible = false;
  SurveyKo.Serializer.findProperty('page', 'requiredIf').visible = false;
  SurveyKo.Serializer.findProperty('page', 'visibleIf').visible = false;
  SurveyKo.Serializer.findProperty('page', 'questionTitleLocation').visible =
    false;
  SurveyKo.Serializer.findProperty(
    'page',
    'navigationButtonsVisibility',
  ).visible = false;
  SurveyKo.Serializer.findProperty('page', 'questionsOrder').visible = false;

  // SurveyKo.Serializer.findProperty('barrating', 'showOptionsCaption').visible =
  //   false;
  SurveyKo.Serializer.findProperty('question', [
    { name: 'hideNumber', default: true },
  ]);

  // creates a custom property to each row in matrixes to configure conditions
  SurveyKo.JsonObject.metaData.addClass(
    'itemvalues_questionId',
    [
      {
        name: 'questionIdMatrix', // readOnly property
      },
      {
        name: 'rowVisibleIf',
        displayName: 'Row Visible If', // changeble property - user can change values in this custom property
      },
      {
        name: 'externalId',
        visible: false,
      },
      {
        name: 'questionType',
        visible: false,
      },
      {
        name: 'internalType',
        visible: false,
      },
    ],
    undefined,
    'itemvalue',
  );

  const choicesProp = SurveyKo.JsonObject.metaData.findProperty(
    'matrix',
    'rows',
  );

  choicesProp.className = 'itemvalues_questionId';

  // need this to make survey creator recognize changes in the custom propetry rowVisibleIf
  SurveyKo.Serializer.addProperty(
    'itemvalues_questionId',
    'rowVisibleIf',
  ).setValue(choicesProp, '', new SurveyKo.JsonObject());

  SurveyKo.Serializer.findProperty(
    'itemvalues_questionId',
    'questionIdMatrix',
  ).readOnly = true;
};
