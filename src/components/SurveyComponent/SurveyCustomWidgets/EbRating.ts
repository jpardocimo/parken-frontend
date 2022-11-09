/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-str */

// adding a custom property into an existent question type (rating type was developed by surveyjs team)
export const EbRating: any = (SurveyKo: any) => {
  return {
    name: 'ebrating',
    isFit(question: any) {
      return question.getType() == 'rating';
    },
    init() {
      SurveyKo.Serializer.addProperty('rating', {
        name: 'choices:itemvalues',
        category: 'Choices',
      });
    },
    isDefaultRender: true,
    afterRender(question: any) {
      if (!question.choices) return;

      question.rateValues = question?.choices;
    },
  };
};
