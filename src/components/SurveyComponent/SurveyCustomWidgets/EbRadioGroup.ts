/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-str */

// adding a custom property into an existent question type (rating type was developed by surveyjs team)
export const EbRadioGroup: any = (SurveyKo: any) => {
  const radio = {
    name: 'ebradiogroup',
    isFit(question: any) {
      return question.getType() == 'radiogroup';
    },
    init() {
      SurveyKo.Serializer.addProperty('radiogroup', {
        name: 'rateValues:itemvalues',
        category: 'RateValues',
      });
    },
    isDefaultRender: true,
    afterRender(question: any, el: any) {
      if (!question.choices) return;

      question.rateValues = question?.choices;
    },
  };

  return radio;
};
