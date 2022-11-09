/* eslint-disable no-alert */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

// creating a custom question type based on noUiSlider lib

export const EbStyledRating: any = (SurveyKo: any) => {
  return {
    name: 'barrating',
    title: 'EB Styled Rating',
    iconName: 'icon-barrating',
    widgetIsLoaded() {
      return typeof $ == 'function';
    },
    defaultJSON: { choices: [1, 2, 3, 4, 5] },
    isFit(question: any) {
      return question.getType() === 'barrating';
    },
    isDefaultRender: true,
    htmlTemplate: '<div><div></div></div>',
    activatedByChanged(activatedBy: any) {
      SurveyKo.JsonObject.metaData.addClass(
        'barrating',
        [
          { name: 'hasOther', visible: false },
          { name: 'otherText', visible: false },
          { name: 'optionsCaption', visible: false },
          { name: 'otherErrorText', visible: false },
          { name: 'storeOthersAsComment', visible: false },
          { name: 'renderAs', visible: false },
          { name: 'select2Config', visible: false },
        ],
        null,
        'dropdown',
      );
      SurveyKo.JsonObject.metaData.addProperty('barrating', {
        name: 'showValues:boolean',
        default: false,
        category: 'general',
      });
      SurveyKo.JsonObject.metaData.addProperty('barrating', {
        name: 'showSelectedRating:boolean',
        displayName: 'Show Choices Caption',
        default: false,
        category: 'general',
      });
      SurveyKo.JsonObject.metaData.addProperty('barrating', {
        name: 'ratingTheme',
        category: 'general',
        default: 'css-stars',
        choices: [
          'fontawesome-stars-o',
          'fontawesome-stars',
          'css-stars',
          'bars-pill',
          'bars-1to10',
          'bars-movie',
          'bars-square',
          'bars-reversed',
          'bars-horizontal',
        ],
      });
    },
    afterRender(question: any, el: any) {
      el.style.paddingTop = '10px';
      el.style.paddingBottom = '5px';
      el.style.height = '80px';
      let $customList: any;
      let $customSelect: any;
      let $questionInput: any;
      const contentContainer = $(el).is('select')
        ? $(el).parent().parent()[0]
        : $(el).parent()[0];

      const renderCustomSelect = function () {
        $customSelect = $("<select class='sv-widget-select'></select>");
        const questionChoices = question.choices.sort((a: any, b: any) => {
          if (a.value > b.value) return -1;
          return a.value < b.value ? 1 : 0;
        });

        if (question.hasNone) {
          $customSelect.append(
            `<option value="none" title="${question.noneText}">${question.noneText}</option>`,
          );
        }

        questionChoices.forEach(function (choice: any) {
          $customSelect.append(
            `<option value="${choice.value}" title="${choice.text}">${choice.text}</option>`,
          );
        });

        $questionInput = $(contentContainer).find(`[id="${question.inputId}"]`);
        $questionInput.css('display', 'none');
        $questionInput.after($customSelect);

        $customSelect[0].selectedIndex = -1;
        $customList = $("<div class='br-widget'></div>");
      };
      const removeCustomSelect = function () {
        $questionInput.css('display', '');

        $customSelect.barrating('destroy');
        $customSelect.remove();
      };
      const renderBarrating = function () {
        $customSelect.barrating('show', {
          theme: question.ratingTheme,
          initialRating: question.value,
          showValues: question.showValues,
          showSelectedRating: question.showSelectedRating,
          readonly: question.isReadOnly,
          onSelect(value: any, text: string) {
            valueChangingByWidget = true;
            question.value = value;
            valueChangingByWidget = false;
          },
        });
      };
      const renderTooltips = function () {
        $('.sv-widget-select')
          .children('option')
          .each(function () {
            const optionValue = (<any>$(this)).attr('value');
            const optionTitle = (<any>$(this)).attr('title');

            $('.br-widget')
              .children('a')
              .each(function () {
                const aValue = (<any>$(this)).attr('data-rating-value');

                if (optionValue == aValue) {
                  (<any>$(this)).attr('title', optionTitle);
                }
              });
          });
      };

      renderCustomSelect();
      renderBarrating();
      renderTooltips();
      if ($customSelect.parents()[0])
        $customSelect.parents()[0].style.marginBottom = '3px';
      let valueChangingByWidget = false;

      question.valueChangedCallback = function () {
        if (
          !valueChangingByWidget &&
          (<any>$(contentContainer).find('select.sv-widget-select')[0])
            .value !== question.value
        ) {
          (<any>(
            $(contentContainer).find('select.sv-widget-select')[0]
          )).barrating('set', question.value);
        }
      };
      question.__barratingOnPropertyChangedCallback = function (
        sender: any,
        options: any,
      ) {
        if (options.name == 'ratingTheme') {
          $customSelect.barrating('destroy');
          renderBarrating();
        }
      };
      question.onPropertyChanged.add(
        question.__barratingOnPropertyChangedCallback,
      );
      question.readOnlyChangedCallback = function () {
        removeCustomSelect();
        renderCustomSelect();
        renderBarrating();
      };
      question.visibleChoicesChangedCallback = function () {
        renderBarrating();
      };
    },
    willUnmount(question: any, el: any) {
      var $contentContainer: any = $(el).is('select')
        ? $(el).parent().parent()
        : $(el).parent();
      var $el = $contentContainer.find('select.sv-widget-select');
      $el.barrating('destroy');
      $el.remove();
      question.valueChangedCallback = undefined;
      question.onPropertyChanged.remove(
        question.__barratingOnPropertyChangedCallback,
      );
      question.__barratingOnPropertyChangedCallback = undefined;
    },
    pdfRender(_: any, options: any) {
      if (options.question.getType() === 'barrating') {
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
