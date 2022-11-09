import React, { useState, useCallback, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { Link } from 'react-router-dom';
import InfoText from './InfoText/info';

import { ButtonNext, Content, GDPRText } from '../styles';

interface Props {
  text: string;
  onStartButtonClick: (event: any) => void;
  // isTso: boolean;
  // isSpiritHoch3: boolean;
  surveyName: string;
  logoPath: string;
  buttonColor: string;
}

const Start: React.FC<Props> = ({
  text,
  onStartButtonClick,
  // isTso,
  // isSpiritHoch3,
  surveyName,
  logoPath,
  buttonColor,
}) => {
  const [visible, setVisible] = useState(false);
  const [visibleButtonNext, setVisibleButtonNext] = useState(true);

  useEffect(() => {
    const dynamicButton = document.getElementById(
      'fortsetzen',
    ) as HTMLButtonElement;

    if (dynamicButton !== null && dynamicButton !== undefined) {
      setVisibleButtonNext(false);
      dynamicButton.addEventListener('click', e => onStartButtonClick(e));
      dynamicButton.setAttribute('class', 'button-fortfahren');
    }
  }, [onStartButtonClick]);

  const handleLocalStorage = useCallback(() => {
    // localStorage.setItem('isTso', isTso.toString());
    // localStorage.setItem('isSpiritHoch3', isSpiritHoch3.toString());

    localStorage.setItem('surveyName', surveyName);
    localStorage.setItem('logoPath', logoPath);
  }, [logoPath, surveyName]);

  return (
    <>
      <Content>
        {ReactHtmlParser(text as string)}
        {visibleButtonNext && (
          <ButtonNext
            buttonColor={buttonColor}
            type="button"
            onClick={onStartButtonClick}
          >
            Fortfahren
          </ButtonNext>
        )}
        <GDPRText>
          {`Vertrauen ist wichtig, besonders wenn es um Ihre Daten geht. Deshalb
            sehen wir es als unsere Verpflichtung, Ihre Daten mit höchster
            Sorgfalt zu verwalten und alles zu tun, um Ihre Informationen vor
            Missbrauch zu schützen.`}
          <br />
          {`Die emotion banking GmbH verarbeitet Ihre
            Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen
            (DSGVO).`}
          <a>
            <Link
              to={{
                pathname: `/moreinfo/`,
                state: { surveyName, logoPath },
              }}
              target="_blank"
              onClick={() => handleLocalStorage()}
            >
              Mehr Information
            </Link>
          </a>
        </GDPRText>
      </Content>

      <InfoText visible={visible}></InfoText>
    </>
  );
};

export default Start;
