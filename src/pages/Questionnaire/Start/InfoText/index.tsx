import React, { useEffect, useLayoutEffect, useState } from 'react';

import InfoText from './info';
import { Container, Content, Header } from './styles';

const MoreInfo: React.FC = () => {
  const [isTso, setIsTSO] = useState(false);
  const [isSpiritHoch3, setIsSpiritHoch3] = useState(false);
  const [surveyName, setSurveyName] = useState('');
  const [logoPath, setLogoPath] = useState('');

  useEffect(() => {
    const isTSOLocal = localStorage.getItem('isTso') !== 'false';
    const isSpiritHoch3Local =
      localStorage.getItem('isSpiritHoch3') !== 'false';

    const logoPathLocal = localStorage.getItem('logoPath');
    const surveyNameLocal = localStorage.getItem('surveyName');

    setIsTSO(isTSOLocal);
    setIsSpiritHoch3(isSpiritHoch3Local);

    setSurveyName(surveyNameLocal ?? '');
    setLogoPath(logoPathLocal ?? '');
  }, []);

  useLayoutEffect(() => {
    const favicon2 = document.getElementById('favicon');
    const prefix = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    document.title = surveyName ?? 'Victor';

    if (isSpiritHoch3) {
      favicon2?.setAttribute(
        'href',
        `${prefix}://${window.location.host}/faviconsp3.ico`,
      );

      return;
    }

    // isTSO
    if (isTso) {
      favicon2?.setAttribute(
        'href',
        `${prefix}://${window.location.host}/favicontso.ico`,
      );
    } else {
      favicon2?.setAttribute(
        'href',
        `${prefix}://${window.location.host}/favicon.ico`,
      );
    }
  }, [isSpiritHoch3, isTso, surveyName]);

  return (
    <>
      <Header>
        <img src={logoPath} alt="Logo - Survey" />
      </Header>
      <Container>
        <Content>
          <InfoText visible={true}></InfoText>
        </Content>
      </Container>
    </>
  );
};

export default MoreInfo;
