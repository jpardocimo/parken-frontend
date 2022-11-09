const options = {};

var creator = new SurveyCreator.SurveyCreator(options);

ko.components.register("svc-tab-template", {

  viewModel: {
    createViewModel: (params, componentInfo) => {
      var model = {
        surveys: loadedSurveyTemplates(),
        load: function (template) {
          creator.makeNewViewActive("designer");
          creator.JSON = template.json;
        }
      };
      return model;
    }
  },

  template: `
    <div style="padding:7px;width:100%">
        <h3 class="sd-title sd-page__title">Templates list</h3>
          <div>
           <button class="sd-btn sd-btn--action" style="margin-top:15px" data-bind="click: $parent.load, text: 'Load ' + name">
           </button>
        </div>
    </div>
    `
    });


const templatesPlugin = {
  activate: () => {},
  deactivate: () => {
    return true;
  }
};


// Add plug-in. We do nothing on activate/deactivate. Place it as first tab and set to "svc-tab-template" the component name
creator.addPluginTab("templates", templatesPlugin, "Survey Templates", "svc-tab-template", 0);


const templateBtnClick = (json) => {
  creator.makeNewViewActive("designer");
  creator.JSON = json;
};

creator.render("creatorElement");

function loadedSurveyTemplates() {
  return [
    {
      name: "NPS",
      json: {}
    }, {
      name: "Dummy checkbox survey",
      json: {}
    }, {
      name: "Empty Survey",
      json: {}
    }
  ];
}


