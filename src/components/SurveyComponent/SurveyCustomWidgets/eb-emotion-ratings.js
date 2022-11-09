/**
 *********************************
 * Emotions Rating - Yanci Nerio *
 *********************************
 * Emotions Rating
 * Version: 2.0.1
 * URL: https://github.com/YanNerio/emotion-ratings
 * Description: This plugin allows you to create ratings using emojis
 * Requires: >= 1.9
 * Author: Yanci Nerio (www.yancinerio.com)
 * License: MIT
 */
import $ from 'jquery';
import emogjiDissatisfiedVery from '../../../assets/emoji_dissatisfied_very.png';
import emogjiDissatisfied from '../../../assets/emoji_dissatisfied.png';
import emogjiNeutral from '../../../assets/emoji_neutral.png';
import emogjiSatisfied from '../../../assets/emoji_satisfied.png';
import emogjiSatisfiedVery from '../../../assets/emoji_satisfied_very.png';
 ;(function($, document, window, undefined) {
  // Optional, but considered best practice by some
  "use strict";

  // Name the plugin so it's only in one place
  let pluginName = 'ebemotionsratings';
  let $element;

  // Default options for the plugin as a simple object
  let defaults = {
      bgEmotion: emogjiNeutral,
      count: 5,
      color: "#d0a658;",
      emotionSize: 30,
      inputName: "ratings[]",
      emotionOnUpdate: null,
      ratingCode: 5,
      disabled: false,
      useCustomEmotions: false,
      transformImages: false,
      onUpdate:function (value) {
      }, // callback fired when a rating is selected
  };
  //the collection of emotions to show on the ratings
  let emotionsArray = [
    emogjiDissatisfiedVery,
    emogjiDissatisfied,
    emogjiNeutral,
    emogjiSatisfied,
    emogjiSatisfiedVery
  ];

  // Plugin constructor
  // This is the boilerplate to set up the plugin to keep our actual logic in one place
  class Plugin {
     constructor(element, options) {
       this.element = element;
       // Merge the options given by the user with the defaults
       this.settings = $.extend({}, defaults, options);
       this.useCustomEmotions = false;
       // Attach data to the element
       this.$el = $(element);
       this.$el.data(name, this);

       this._defaults = defaults;
       this._name = pluginName;

       let meta = this.$el.data(name + '-opts');
       this.opts = $.extend(this._defaults, options, meta);

       this.containerCode = this.$el.attr('id');
       this.elementContainer = $(element);
       this.styleCode = 'emotion-style-' + this.containerCode;
       this.containerCode = 'emotion-container-' + this.containerCode;
       this.code = 'emoji-rating-' + this.containerCode;

       this.clicked = [];
       this.clicked[this.containerCode] = false;

       this.init();

     }
     // Public functions accessible to users
     // Prototype methods are shared across all elements
     // You have access to this.settings and this.element
     init() {
       $element = $(this.element);
       this.count = 0;
       this.manageClick();
       this.emotionStyle();
       this.renderEmotion();
       this.manageHover();
     }

     emotionStyle() {
       let styles = "." + this.styleCode + "{margin-right:3px;border-radius: 50%;cursor:pointer;opacity:0.3;display: inline-block;font-size:"
         + this.settings.emotionSize + "px; text-decoration:none;line-height:0.9;text-align: center;color:" + this.settings.color + "}";
       $element.append("<style>" + styles + "</style>");
     }

     renderEmotion() {
       let container = "<div class='" + this.containerCode + "'>";
       let emotionDiv;
       let questionCount = this.settings.question.choices.length

       for (let i = questionCount; i >= 1; i -= 1) {
         emotionDiv =  "<img src='" + emotionsArray[questionCount-i] + "' class='" + this.styleCode + "' data-index='" + i + "'>";
         container += emotionDiv
       }

       container += "</div>";
       $element.append(container);
       if (this.settings.initialRating > 0) {
         this.initalRate(this.settings.initialRating);
       }

     }

     clearEmotion() {
      let self = this;
       if (!this.settings.disabled) {
         self.elementContainer.find("." + this.styleCode + "").each(function () {
           $(this).css("opacity", 0.3);
         });
       }
     }

     showEmotion(count) {
        let self = this;
        let emotion = getEmotion(this.settings.emotions, count, false);
        let position = count-1;
        this.clearEmotion();

        self.elementContainer.find("." + this.styleCode + "").eq(position).css("opacity", 1);
        self.elementContainer.find("." + this.styleCode + "").eq(position).html(emotion);
        self.elementContainer.find("." + this.styleCode + "").eq(position).attr('title', `${this.settings.question.choices[position]?.text}`);

     }

     manageHover() {
       let self = this;
       if (!self.settings.disabled ) {
         this.elementContainer.on({
           mouseenter: function () {
              let count = parseInt($(this).data("index"), 10);
              let questionCount = self.settings.question.choices.length
              self.showEmotion(questionCount - count +1);
           },
           mouseleave: function () {
              self.clearEmotion();
              let selectedItem  = self.elementContainer.find("#selectedItem");

              let index = selectedItem[0]?.value ? parseInt(selectedItem[0].value,10) : '';
              if(index !=''){
                let questionCount = self.settings.question.choices.length
                self.showEmotion(questionCount - index +1);
              }
           }
         }, "." + this.styleCode + "");
       }
     }

     manageClick() {
       let self = this;
       if (!self.settings.disabled) {
         self.elementContainer.on("click", "." + self.styleCode + "", function () {
            let index = $(this).data("index");
            let count = parseInt(index, 10);
            self.count = count;
            self.updateInput(count);
            self.settings.onUpdate.call(self,count);
            let questionCount = self.settings.question.choices.length
             self.showEmotion(questionCount - count +1);
         });
       }
     }

     initalRate(count) {
       let self = this;
       self.showEmotion(count);
     }

     updateInput(count) {
      let self = this;
        let _input = self.elementContainer.find("#selectedItem");
        _input.val(count);
     }
   }

  //Avoiding conflicts with prototype
  $.extend();

  $.fn[pluginName] = function(options) {
      // Iterate through each DOM element and return it
      return this.each(function() {
          // prevent multiple instantiations
          if (!$.data(this, 'plugin_' + pluginName)) {
              $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
          }
      });
  };

  let getEmotion = function(_emotions,count, onlyIndex = false) {
      let emotion;
      let emotionsLength = _emotions.length;
      if (emotionsLength == 1) {
          emotion = onlyIndex ? 0 : emotionsArray[_emotions[0]];
      }else{
        let emotionIndex = (count-1);
        emotion = onlyIndex
                ? (emotionIndex > (emotionsLength-1))
                    ? (emotionsLength-1) : emotionIndex
                : emotionsArray[_emotions[count-1]];
      }
      return emotion;
  }

})($, document, window);
