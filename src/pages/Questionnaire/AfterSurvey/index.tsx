import React, { useEffect } from 'react';
import {
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

import {
  // Container,
  BoxShareSocialMedia,
  TextGrayImgPosition1,
  TextGrayImgPosition2,
  TextGrayImgPosition3,
  TextRedImgPosition1,
  TextRedImgPosition2,
  TextRedImgPosition3,
  Header,
  Content,
  BoxVideo,
  Card,
  Button,
  Footer,
  FooterBoxLinkedin,
  DivTso,
  CircleNumber,
} from './styles';

const AfterSurvey: React.FC = () => {
  useEffect(() => {
    const favicon2 = document.getElementById('favicon');
    const prefix = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    document.title = 'TSÖ - Top Service Österreich';

    favicon2?.setAttribute(
      'href',
      `${prefix}://${window.location.host}/favicontso.ico`,
    );
  }, []);

  return (
    <>
      <Header>
        <span>IHRE NÄCHSTEN SCHRITTE</span>
      </Header>
      {/* <Container> */}
      <Content>
        <Card>
          <TextRedImgPosition1>VERTIEFEN SIE IHR WISSEN</TextRedImgPosition1>
          <TextGrayImgPosition1>
            Die Geschäftsführerin von Top Service Österreich, Dr. Barbara Aigner
            erklärt
          </TextGrayImgPosition1>
          <BoxVideo>
            <iframe
              width="245"
              height="140"
              src="https://www.youtube.com/embed/1PnbZdjo5YE"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </BoxVideo>
          <CircleNumber>
            <p>1</p>
          </CircleNumber>
        </Card>
        <Card>
          <TextRedImgPosition2>SPRECHEN SIE MIT UNS!</TextRedImgPosition2>
          <TextGrayImgPosition2>
            Vereinbare einen Termin mit unserer Customer Insights Expertin Lisa
            Fankhauser
          </TextGrayImgPosition2>
          <a
            href="https://outlook.office365.com/owa/calendar/TopServicesterreich@emotion-banking.at/bookings/s/2d_pVi38UEqXGA2-Kq0DGw2"
            target="_blank"
            rel="noreferrer"
          >
            <Button>Termin buchen</Button>
          </a>
          <CircleNumber>
            <p>2</p>
          </CircleNumber>
        </Card>
        <Card>
          <TextRedImgPosition3>LEITEN SIE UNS WEITER</TextRedImgPosition3>
          <TextGrayImgPosition3>
            Teile den Customer Orientation Score mit deinen Kolleg:innen und
            Partner:innen
          </TextGrayImgPosition3>
          <BoxShareSocialMedia>
            <EmailShareButton
              subject="Customer Orientation Score Selbsttest von TSÖ"
              body="Hallo,

                    ich habe gerade den Selbsttest zum Customer Orientation Score von Top Service Österreich ausgefüllt und gleich meine Ergebnisse in Echtzeit erhalten.

                    Das könnte auch für dich interessant sein. Hier der Link:  "
              separator=" "
              url="https://meine-sicht.com/questionnaire/93?chart=bubbleTree"
            >
              <EmailIcon size={40} />
            </EmailShareButton>

            <WhatsappShareButton
              title="Hallo,

                    ich habe gerade den Selbsttest zum Customer Orientation Score von Top Service Österreich ausgefüllt und gleich meine Ergebnisse in Echtzeit erhalten.

                    Das könnte auch für dich interessant sein. Hier der Link: "
              url="https://meine-sicht.com/questionnaire/93?chart=bubbleTree"
            >
              <WhatsappIcon size={40} />
            </WhatsappShareButton>

            <LinkedinShareButton
              source="Hallo,

                ich habe gerade den Selbsttest zum Customer Orientation Score von Top Service Österreich ausgefüllt und gleich meine Ergebnisse in Echtzeit erhalten.

                Das könnte auch für dich interessant sein. Hier der Link:"
              title="Hallo,

                ich habe gerade den Selbsttest zum Customer Orientation Score von Top Service Österreich ausgefüllt und gleich meine Ergebnisse in Echtzeit erhalten.

                Das könnte auch für dich interessant sein. Hier der Link:"
              summary="Hallo,

                ich habe gerade den Selbsttest zum Customer Orientation Score von Top Service Österreich ausgefüllt und gleich meine Ergebnisse in Echtzeit erhalten.

                Das könnte auch für dich interessant sein. Hier der Link:"
              url="https://meine-sicht.com/questionnaire/93?chart=bubbleTree"
            >
              <LinkedinIcon size={40} />
            </LinkedinShareButton>
          </BoxShareSocialMedia>
          <CircleNumber>
            <p>3</p>
          </CircleNumber>
        </Card>
      </Content>
      <Footer>
        <a
          href="https://www.top-service-oesterreich.at/"
          target="_blank"
          rel="noreferrer"
        >
          <DivTso>
            <img
              width="160"
              className="el-image"
              alt="Top Service Österreich"
              data-src="/wp-content/uploads/2021/03/logo.svg"
              uk-img=""
              src="https://www.top-service-oesterreich.at/wp-content/uploads/2021/03/logo.svg"
            ></img>
          </DivTso>
        </a>
        <a
          href="https://www.linkedin.com/company/top-service-oesterreich/?originalSubdomain=at"
          target="_blank"
          rel="noreferrer"
        >
          <FooterBoxLinkedin>
            <div>
              <p>Folgen Sie uns auf LinkedIn,</p>
              <p>damit Sie keine Neuigkeiten</p>
              <p>mehr verpassen</p>
            </div>

            <LinkedinIcon size={50} />
          </FooterBoxLinkedin>
        </a>
      </Footer>
    </>
  );
};

export default AfterSurvey;
