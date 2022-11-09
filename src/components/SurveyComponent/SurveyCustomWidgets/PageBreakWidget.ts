/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-str */

export const PageBreakWidget: any = (SurveyKo: any) => {
  return {
    name: `pagebreak`,
    title: 'Page Break',
    iconName: 'icon-editor',
    type: 'pagebreak',

    widgetIsLoaded() {
      return true; // We do not have external scripts
    },
    isFit(question: { getType: () => string }) {
      return question.getType() === 'pagebreak';
    },

    init() {
      // Creates a page break class to make surveyCreator reacognize this type of element in its json.
      // otherwise, pagebreaks dont appears in survey json neither is saved into database.
      SurveyKo.Serializer.addClass('pagebreak', [], undefined, 'empty');

      SurveyKo.JsonObject.metaData.addProperties('pagebreak', [
        { name: 'hideNumber', default: true },
      ]);
    },

    isDefaultRender: true,

    afterRender(
      question: {
        value: string;
        title: string;
        valueChangedCallback: () => void;
        isReadOnly: any;
        readOnlyChangedCallback: () => void;
      },
      el: {
        getElementsByClassName: (arg0: string) => any;
        getElementsByTagName: (arg0: string) => any;
      },
    ) {
      let editor = el.getElementsByClassName('pagebreak');

      if (editor.length === 0) return;
      editor = editor[0];
      editor.innerHTML = `<div></div>`;
    },
  };
};
