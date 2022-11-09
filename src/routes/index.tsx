import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';

import Questions from '../pages/Questions/index';
import QuestionTranslations from '../pages/Questions/Translations';
import CreateQuestion from '../pages/Questions/New';
import EditQuestion from '../pages/Questions/Edit';
import LanguageSettings from '../pages/LanguageSettings';
import Surveys from '../pages/Surveys';
import CreateSurvey from '../pages/Surveys/New';
import EditSurvey from '../pages/Surveys/Edit';
import Survey from '../pages/Questionnaire';
import MoreInfo from '../pages/Questionnaire/Start/InfoText/index';
import Products from '../pages/Products';
import SurveyTemplate from '../pages/Products/SurveyTemplate';
import SurveyTemplateDemo from '../pages/Products/SurveyTemplate/Demo';
import CreateProduct from '../pages/Products/New';
import CreateStructure from '../pages/Products/Structure';
import TemplateDecision from '../pages/Products/TemplateDecision';
import CreateProject from '../pages/Projects/New';
import EditProject from '../pages/Projects/Edit';
import Projects from '../pages/Projects';
import ProjectDashboard from '../pages/Projects/Dashboard';
import ProjectParticipation from '../pages/Projects/Participation';
import ProjectAnalytics from '../pages/Projects/Analytics';
import Customers from '../pages/Customers';
import CreateCustomer from '../pages/Customers/New';
import EditCustomer from '../pages/Customers/Edit';
import MatrixList from '../pages/MatrixQuestions';
import CreateMatrixStep1 from '../pages/MatrixQuestions/New/Step1';
import CreateMatrixStep2 from '../pages/MatrixQuestions/New/Step2';
import SurveyTexts from '../pages/SurveyTexts';
import CreateSurveyText from '../pages/SurveyTexts/New';
import EditSurveyText from '../pages/SurveyTexts/Edit';
import Logos from '../pages/Logos';
import CreateLogo from '../pages/Logos/New';

import Images from '../pages/Images';
import UploadImages from '../pages/Images/New';

import Accesses from '../pages/Accesses';
import CreateAccess from '../pages/Accesses/New';
import EditAccess from '../pages/Accesses/Edit';
import ExportResult from '../pages/Surveys/ExportResult';
import Analytics from '../pages/Surveys/Analytics';
import Style from '../pages/Surveys/Style';
import AfterSurvey from '../pages/Questionnaire/AfterSurvey/index';

import Respondents from '../pages/Respondents';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/questions" exact component={Questions} isPrivate />
    <Route path="/questions/new" component={CreateQuestion} isPrivate />
    <Route
      path="/questions/edit/:questionId"
      component={EditQuestion}
      isPrivate
    />
    <Route
      path="/questions/translations"
      exact
      component={QuestionTranslations}
      isPrivate
    />
    <Route path="/languageSettings" component={LanguageSettings} isPrivate />

    <Route path="/surveys" exact component={Surveys} isPrivate />

    <Route
      path="/surveys/project/:projectId"
      exact
      component={Surveys}
      isPrivate
    />
    <Route path="/surveys/new" component={CreateSurvey} isPrivate />
    <Route path="/surveys/:surveyId" exact component={EditSurvey} isPrivate />
    <Route
      path="/surveys/:surveyId/accesses"
      exact
      component={Accesses}
      isPrivate
    />
    <Route
      path="/surveys/:surveyId/accesses/new"
      exact
      component={CreateAccess}
      isPrivate
    />
    <Route
      path="/surveys/:surveyId/accesses/edit/:accessId"
      exact
      component={EditAccess}
      isPrivate
    />
    <Route
      path="/surveys/:surveyId/export"
      exact
      component={ExportResult}
      isPrivate
    />
    <Route
      path="/surveys/:surveyId/analytics"
      exact
      component={Analytics}
      isSurvey
    />

    <Route path="/style" exact component={Style} isSurvey />

    <Route
      path="/projects/:projectId/analytics"
      exact
      component={ProjectAnalytics}
      isPrivate
    />

    <Route path="/questionnaire/:accessId/:code?" component={Survey} isSurvey />

    <Route path="/aftersurvey" exact component={AfterSurvey} isSurvey />

    <Route path="/moreinfo/" exact component={MoreInfo} isSurvey />

    <Route path="/projects/new" component={CreateProject} isPrivate />

    <Route path="/projects/edit/:projectId" component={EditProject} isPrivate />

    <Route path="/projects" exact component={Projects} isPrivate />

    <Route
      path="/projects/:projectId/dashboard"
      exact
      component={ProjectDashboard}
      isPrivate
    />
    <Route
      path="/projects/:projectId/participation"
      exact
      component={ProjectParticipation}
      isPrivate
    />

    <Route path="/products" exact component={Products} isPrivate />
    <Route
      path="/products/surveyTemplate"
      exact
      component={SurveyTemplate}
      isPrivate
    />
    <Route
      path="/products/surveyTemplate/:surveyId"
      exact
      component={SurveyTemplateDemo}
      isSurvey
    />
    <Route
      path="/products/templateDecision"
      exact
      component={TemplateDecision}
      isPrivate
    />
    <Route path="/products/new" component={CreateProduct} isPrivate />
    <Route
      path={['/products/structure', '/products/structure/:productId']}
      exact
      component={CreateStructure}
      isPrivate
    />

    <Route path="/customers" exact component={Customers} isPrivate />
    <Route path="/customers/new" component={CreateCustomer} isPrivate />
    <Route path="/customers/edit/:id" component={EditCustomer} isPrivate />

    <Route path="/matrixQuestions" exact component={MatrixList} isPrivate />
    <Route
      path="/matrixQuestions/step1"
      exact
      component={CreateMatrixStep1}
      isPrivate
    />
    <Route
      path={['/matrixQuestions/step2', '/matrixQuestions/step2/:productId']}
      exact
      component={CreateMatrixStep2}
      isPrivate
    />

    <Route
      path={['/surveyTexts', '/surveyTexts/type/:textType?']}
      exact
      component={SurveyTexts}
      isPrivate
    />
    <Route path="/surveyTexts/new" component={CreateSurveyText} isPrivate />
    <Route path="/surveyTexts/edit/:id" component={EditSurveyText} isPrivate />

    <Route path="/logos" exact component={Logos} isPrivate />
    <Route path="/logos/new" component={CreateLogo} isPrivate />

    <Route path="/Images" exact component={Images} isPrivate />
    <Route path="/Images/new" component={UploadImages} isPrivate />

    <Route path="/respondents" exact component={Respondents} isPrivate />
  </Switch>
);

export default Routes;
