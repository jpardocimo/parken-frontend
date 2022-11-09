/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-cond-assign */
/* eslint-disable array-callback-return */
import $ from 'jquery';

interface Access {
  segments: string[];
  name: string;
  accessId: number;
}

interface Segment {
  value: boolean;
  text: string;
}

function _x(STR_XPATH: string) {
  const xresult = document.evaluate(
    STR_XPATH,
    document,
    null,
    XPathResult.ANY_TYPE,
    null,
  );
  const xnodes = [];
  let xres;
  while ((xres = xresult.iterateNext())) {
    xnodes.push(xres);
  }

  return xnodes;
}

export const CustomCheckBox: any = (
  SurveyKo: any,
  accesses: any,
  SurveyJSCreator: any,
  refreshCustomComponentsNames: any,
  refreshQuestionVisibility: any,
) => {
  refreshCustomComponentsNames();

  let segmentsArray: Segment[] = [];
  if (accesses) {
    accesses.map((access: Access) => {
      access.segments.map((segment: string) => {
        if (!segmentsArray.some(s => s.text === segment)) {
          segmentsArray.push({
            value: false,
            text: segment,
          });
        }
      });
    });

    if (segmentsArray) {
      segmentsArray = segmentsArray.sort((a: any, b: any) => {
        if (a.text < b.text) return -1;
        return a.text > b.text ? 1 : 0;
      });
      // add segment category with custom control(list of segments w/ checkbox created above)

      // custom html component
      const checkboxSegmentsComponent = {
        render(editor: any, htmlElement: any) {
          const oldValuesToLoadChecked = editor.koValue() ?? [];
          const arraySegments: string[] = [];

          segmentsArray.map((item, i) => {
            // div item segment
            const div = document.createElement('div');
            div.className = 'form-control svd_editor_control';
            div.style.marginBottom = '5px';
            div.style.width = '100%';
            div.style.cursor = 'pointer';

            // checkbox segment
            const input = document.createElement('input');
            input.id = `ailton-checkbox-${i}`;
            input.type = 'checkbox';
            input.checked = oldValuesToLoadChecked.some(
              // load from database checked, if already checked before
              (segment: string) => segment === item.text,
            );
            input.value = item.text;

            // checkbox segment
            const labelForCheckbox = document.createElement('label');
            labelForCheckbox.innerHTML = item.text;
            labelForCheckbox.setAttribute('for', `ailton-checkbox-${i}`);
            labelForCheckbox.style.marginLeft = '5px';

            div.appendChild(input);
            div.appendChild(labelForCheckbox);
            htmlElement.appendChild(div);

            // add or remove from surveyJS json text (question)
            $(input).on('change', function () {
              const arrToAdd: string[] = [];

              const oldVal = editor.koValue() ?? [];

              if (this.checked) {
                const newSetArray: string[] = [];
                newSetArray.push(this.value);
                arrToAdd.push(...oldVal, ...newSetArray);
              } else {
                const newSetArray = oldVal.filter(
                  (val: string) => val !== this.value,
                );
                arrToAdd.push(...newSetArray);
              }

              /// tests
              arraySegments.splice(0, arraySegments.length);
              arraySegments.push(...arrToAdd);

              let segmentList = '';

              arraySegments.map(seg => {
                segmentList = segmentList.concat(seg, ',');
                return segmentList;
              });

              // remove last extra comma
              const segmentListAsString = segmentList.slice(
                0,
                segmentList.length - 1,
              );

              // get question name from surveyCreator Dropdown element selector (property box)
              const questionName = $(
                _x(
                  '/html/.//*[@id="creatorElement"]/div/div/div[2]/div/div/div/div[1]/div[1]/div/svd-designer-container/div[2]/div/div[2]/div/div/div/div[1]/svd-property-grid/div/div/div[1]/div/svd-dropdown/label/div/select',
                ),
              )
                .children('option:selected')
                .text();

              // Refresh Data setting VisibleIf property for selected segments
              refreshQuestionVisibility(
                segmentListAsString,
                questionName.substring(2, questionName.length),
              );

              editor.koValue(arrToAdd);
            });
          });
        },
      };

      // register html custom component
      SurveyJSCreator.SurveyPropertyEditorFactory.registerCustomEditor(
        'customSegmentType',
        checkboxSegmentsComponent,
      );

      // add segments checkbox list component
      SurveyKo.JsonObject.metaData.addProperty('question', {
        name: 'Segments',
        type: 'customSegmentType',
        category: 'Segments',
        visibleIndex: 3,
      });

      // add visible if property
      // this property should appears only if the survey has some segment
      // SurveyKo.Serializer.addProperty('question', {
      //   name: 'visibleIf',
      //   dependsOn: ['Segments'],
      //   visibleIf(obj: { Segments: string[] }) {
      //     if (obj.Segments !== undefined) {
      //       return obj?.Segments.length > 0;
      //     }
      //     return false;
      //   },
      //   category: 'Segments',
      //   readOnly: false,
      // });
    }
  }
};
