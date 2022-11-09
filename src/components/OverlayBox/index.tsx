import React, {
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

import { Container, WrapBox, TooltipError } from './styles';

import api from '../../services/api';

interface Props {
  resultId: number;
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  code?: string;
  htmlIdToScroll?: string;
  backgroundColor?: string;
  campaignNewsletter: string; // code for campaign in getResponse
}

const OverlayBox: React.FC<Props> = ({
  resultId,
  setShowOverlay,
  code,
  htmlIdToScroll,
  backgroundColor,
  campaignNewsletter,
}) => {
  const [invalidMailError, setInvalidMailError] = useState('');
  const [uncheckedReport, setUncheckedReport] = useState('');
  const [istNoneAcceptanceChecked, setIsNoneAcceptanceChecked] =
    useState(false);

  useEffect(() => {
    document.getElementsByTagName('html')[0].classList.add('stop-scrolling');
    document.body.classList.add('stop-scrolling');
  }, []);

  const scrollAnimate = useCallback(() => {
    if (htmlIdToScroll) {
      const yOffset = -90;
      const chartDiv = document.getElementById(htmlIdToScroll);
      const y = chartDiv ? chartDiv.getBoundingClientRect().top + yOffset : 0;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [htmlIdToScroll]);

  const handleSaveEmail = useCallback(async () => {
    const inputReportAcceptanceAcceptance = document.getElementById(
      'reportAcceptance',
    ) as HTMLInputElement;

    const noneAcceptance = document.getElementById(
      'noneAcceptance',
    ) as HTMLInputElement;

    const inputEmail = document.getElementById('email') as HTMLInputElement;
    setUncheckedReport('');

    const isMailValid = istNoneAcceptanceChecked
      ? true
      : inputEmail.checkValidity();

    if (isMailValid || noneAcceptance.checked) {
      setInvalidMailError('');

      if (!noneAcceptance.checked && !inputReportAcceptanceAcceptance.checked) {
        setUncheckedReport('*Required');
      } else {
        const respondent = {
          email: noneAcceptance.checked ? 'Anonymous' : inputEmail.value,
          resultId,
          code,
          reportAcceptance: inputReportAcceptanceAcceptance.checked,
          newsletterAcceptance: inputReportAcceptanceAcceptance.checked,
          campaignNewsletter,
        };

        await api.post('/respondents', respondent);
        document
          .getElementsByTagName('html')[0]
          .classList.remove('stop-scrolling');
        document.body.classList.remove('stop-scrolling');
        setShowOverlay(false);
        scrollAnimate();
      }
    } else {
      setInvalidMailError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    }
  }, [
    istNoneAcceptanceChecked,
    resultId,
    code,
    campaignNewsletter,
    setShowOverlay,
    scrollAnimate,
  ]);

  return (
    <Container backgroundColor={backgroundColor}>
      <WrapBox>
        <h3>
          JETZT zusätzlich zu der Ergebnisübersicht, den vollständigen Report
          inkl. BENCHMARKS kostenfrei erhalten!
        </h3>
        <p>
          <b>
            Interesse, an einer detaillierten Auswertung? Mit Ihren
            Einzelantworten dieses Checks inkl. externer Benchmark? Plus:
            Erkenntnis, wo Sie über der Benchmark liegen und wo es noch konkrete
            Ansatzpunkte für Ihre Organisation gibt? Und wie der nächste Schritt
            aussehen kann? Wunderbar! Dann einfach hier Ihre E-Mail-Adresse
            hinterlassen und wir kümmern uns umgehend darum.
          </b>
        </p>
      </WrapBox>

      <WrapBox>
        <label htmlFor="report">
          <input
            type="checkbox"
            id="reportAcceptance"
            name="reportAcceptance"
            onChange={e => {
              const inputNoneAcceptance = document.getElementById(
                'noneAcceptance',
              ) as HTMLInputElement;

              if (e.target.checked && inputNoneAcceptance?.checked) {
                inputNoneAcceptance.checked = false;
                setIsNoneAcceptanceChecked(!e.target.checked);
              }
            }}
          />
          {uncheckedReport && (
            <TooltipError left="1%">
              <span>{uncheckedReport}</span>
            </TooltipError>
          )}
          Ja, bitte senden Sie mir zusätzlich meine Detailergebnisse inkl.
          Benchmarks (Top10 Unternehmen) zu. Ich willige ein, dass meine
          E-Mail-Adresse gespeichert und für die Kontaktaufnahme genutzt wird.
          Hier geht’s zur
          <a
            href="https://www.emotion-banking.at/datenschutz/"
            target="_blank"
            rel="noreferrer"
          >
            Datenschutzerklärung
          </a>
          .
        </label>

        <br></br>
        <input
          type="checkbox"
          id="noneAcceptance"
          name="noneAcceptance"
          onChange={e => {
            const inputReportAcceptance = document.getElementById(
              'reportAcceptance',
            ) as HTMLInputElement;

            if (e.target.checked && inputReportAcceptance?.checked) {
              inputReportAcceptance.checked = false;
            }
            setIsNoneAcceptanceChecked(e.target.checked);
          }}
        />
        <label htmlFor="none">
          Nein, ich möchte keine Detailergebnisse erhalten und auch nicht von
          Ihnen kontaktiert werden. Mit dem Klick auf das Kästchen erhalten Sie
          Ihre Übersichtsergebnisse.
        </label>
      </WrapBox>

      <div className="c-formContainer">
        {istNoneAcceptanceChecked ? (
          <button
            className="c-form__button__dismiss"
            type="button"
            onClick={handleSaveEmail}
          >
            Zu meinen Ergebnissen
          </button>
        ) : (
          <>
            <form
              className="c-form"
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <input
                className="c-form__input"
                placeholder="E-Mail-Adresse hier einfügen"
                type="email"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                {...(istNoneAcceptanceChecked
                  ? { required: false }
                  : { required: true })}
                id="email"
              />

              {invalidMailError && (
                <TooltipError left="40%">
                  <span>{invalidMailError}</span>
                </TooltipError>
              )}

              <label className="c-form__buttonLabel" htmlFor="checkbox">
                <button
                  className="c-form__button"
                  type="button"
                  onClick={handleSaveEmail}
                >
                  Abschicken
                </button>
              </label>
            </form>
          </>
        )}
      </div>
    </Container>
  );
};

export default OverlayBox;
