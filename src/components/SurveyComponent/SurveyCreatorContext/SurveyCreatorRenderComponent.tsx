import React, { useContext, useEffect } from 'react';
import { SurveyCreatorContext } from './SurveyCreatorContext';

const SurveyCreatorRenderComponent: React.FC = () => {
  const { surveyCreator } = useContext(SurveyCreatorContext);

  useEffect(() => {
    surveyCreator?.render('creatorElement');
  }, [surveyCreator]);

  return (
    <div id="surveyContainer">
      <div id="creatorElement"></div>
    </div>
  );
};

export default SurveyCreatorRenderComponent;
