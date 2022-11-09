/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

// creating a custom question type based on noUiSlider lib
import noUiSlider from 'nouislider';

function parseNumberArray(input: any) {
  if (Object.prototype.toString.call(input) !== '[object Array]') return null;

  return input.map(function (item: any) {
    let value = item;
    if (item.value !== undefined) {
      value = item.value;
    }
    return parseInt(value, 10);
  });
}

export const EbSlider: any = (SurveyKo: any) => {
  return {
    name: 'ebslider',
    title: 'EB Slider',
    iconName: 'icon-nouislider',
    widgetIsLoaded() {
      return typeof noUiSlider !== 'undefined';
    },
    isFit(question: any) {
      return question.getType() === 'ebslider';
    },
    htmlTemplate: '<div><div></div></div>',
    activatedByChanged(activatedBy: any) {
      SurveyKo.JsonObject.metaData.addClass('ebslider', [], null, 'empty');
      SurveyKo.JsonObject.metaData.addProperties('ebslider', [
        {
          name: 'rangeName:stringvalues',
          default: null,
          category: 'Slider',
        },
        {
          name: 'start:itemvalues',
          default: [0],
          category: 'Slider',
        },
        {
          name: 'step:number',
          default: 1,
          category: 'Slider',
        },
        {
          name: 'rangeMin:number',
          default: 1,
          category: 'Slider',
        },
        {
          name: 'rangeMax:number',
          default: 5,
          category: 'Slider',
        },
        {
          name: 'pipsMode',
          default: 'values',
          category: 'Slider',
        },
        {
          name: 'pipsValues:itemvalues',
          default: [1, 2, 3, 4, 5],
          category: 'Slider',
        },
        {
          name: 'pipsText:itemvalues',
          default: [1, 2, 3, 4, 5],
          category: 'Slider',
        },
        {
          name: 'pipsDensity:number',
          default: 25,
          category: 'Slider',
        },
        {
          name: 'orientation:string',
          default: window.screen.width > 1560 ? 'horizontal' : 'vertical',
          category: 'Slider',
        },
        {
          name: 'direction:string',
          default: 'ltr',
          category: 'Slider',
        },
        {
          name: 'choices:itemvalues',
          category: 'Choices',
          choices: [],
        },
      ]);
    },
    afterRender(question: any, el: any) {
      el.style.paddingBottom = '19px';
      el.style.paddingRight = '80px';
      el.style.paddingTop = '30px';
      el.style.paddingLeft = '80px';
      el.style.maxWidth = '95%';
      el = el.children[0];
      el.style.marginBottom = '60px';
      if (question.orientation === 'vertical') {
        el.style.height = '250px';
      }

      const slider = noUiSlider.create(el, {
        start:
          question.orderChoices && question.orderChoices === 'desc value'
            ? question?.choices?.length
            : parseNumberArray(question.start),

        connect:
          question.orderChoices && question.orderChoices === 'desc value'
            ? [false, true]
            : [true, false],
        step: question.step,
        tooltips: false,
        pips: {
          mode: question.pipsMode || 'positions',
          values: question.choices.map(function (choice: any) {
            let pipValue = choice;
            if (choice.value !== undefined) {
              pipValue = choice.value;
            }
            return parseInt(pipValue, 10);
          }),
          density: question.pipsDensity || question?.choices?.length * 5,
          format: {
            to(pVal) {
              let pipText = pVal;
              question.choices.forEach(function (choice: any) {
                if (choice.text != undefined && pVal == choice.value) {
                  pipText = choice.text;
                }
              });
              return pipText;
            },
          },
        },
        range: {
          min: 1,
          max: question?.choices?.length,
        },
        orientation:
          window.screen.width > 1560 ? question.orientation : 'vertical',

        direction:
          question.orderChoices && question.orderChoices === 'desc value'
            ? window.screen.width > 1560
              ? 'rtl'
              : 'ltr'
            : window.screen.width > 1560
            ? 'ltr'
            : 'rtl',
      });

      slider.on('change', function () {
        question.value = Number(slider.get());
      });
      const updateValueHandler = function () {
        slider.set(question.value);
      };
      if (question.isReadOnly) {
        el.setAttribute('disabled', true);
      }
      updateValueHandler();
      question.updateRanking = function () {
        question.noUiSlider.destroy();
        question.noUiSlider = null;
        const sliderGisele = noUiSlider.create(el, {
          start:
            question.orderChoices && question.orderChoices === 'desc value'
              ? question?.choices?.length
              : parseNumberArray(question.start),

          connect:
            question.orderChoices && question.orderChoices === 'desc value'
              ? [false, true]
              : [true, false],
          step: question.step,
          tooltips: false,
          pips: {
            mode: question.pipsMode || 'positions',
            values: question.choices.map(function (choice: any) {
              let pipValue = choice;
              if (choice.value !== undefined) {
                pipValue = choice.value;
              }
              return parseInt(pipValue, 10);
            }),
            density: question.pipsDensity || question?.choices?.length * 5,
            format: {
              to(pVal) {
                let pipText = pVal;
                question.choices.forEach(function (choice: any) {
                  if (choice.text != undefined && pVal == choice.value) {
                    pipText = choice.text;
                  }
                });
                return pipText;
              },
            },
          },
          range: {
            min: 1,
            max: question?.choices?.length,
          },
          orientation:
            window.screen.width > 1560 ? question.orientation : 'vertical',

          direction:
            question.orderChoices && question.orderChoices === 'desc value'
              ? window.screen.width > 1560
                ? 'rtl'
                : 'ltr'
              : window.screen.width > 1560
              ? 'ltr'
              : 'rtl',
        });

        question.noUiSlider = slider;
      };
      question.noUiSlider = slider;
      question.valueChangedCallback = updateValueHandler;
      question.readOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          el.setAttribute('disabled', true);
        } else {
          el.removeAttribute('disabled');
        }
      };
    },
    willUnmount(question: any, el: any) {
      if (question.noUiSlider) {
        question.noUiSlider.destroy();
        question.noUiSlider = null;
      }
      const arr = (window as any).$(el).children('.noUi-target');
      if (arr.length && arr[0].noUiSlider) {
        arr[0].noUiSlider.destroy();
      }
      question.readOnlyChangedCallback = null;
    },
    pdfRender(_: any, options: any) {
      if (options.question.getType() === 'ebslider') {
        const point = options.module.SurveyHelper.createPoint(
          options.module.SurveyHelper.mergeRects.apply(null, options.bricks),
        );
        point.xLeft += options.controller.unitWidth;
        point.yTop +=
          options.controller.unitHeight *
          options.module.FlatQuestion.CONTENT_GAP_VERT_SCALE;
        const rect = options.module.SurveyHelper.createTextFieldRect(
          point,
          options.controller,
        );
        const textboxBrick = new options.module.TextFieldBrick(
          options.question,
          options.controller,
          rect,
          true,
          options.question.id,
          options.question.value || options.question.defaultValue,
          '',
          options.question.isReadOnly,
          false,
          'text',
        );
        options.bricks.push(textboxBrick);
      }
    },
  };
};
