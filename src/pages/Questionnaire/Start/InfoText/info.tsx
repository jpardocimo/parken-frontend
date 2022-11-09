import React from 'react';

import { Container } from './styles';

interface InfoTextProp {
  visible: boolean;
}

const InfoText: React.FC<InfoTextProp> = ({ visible }) => {
  if (!visible) return <></>;

  return (
    <Container>
      <h2>Datenschutzerklärung - Umfragen</h2>
      <p>
        In diesen Datenschutzinformationen informieren wir Sie über die
        wichtigsten Aspekte der Datenverarbeitung auf Grundlage der gesetzlichen
        Bestimmungen (DSGVO).
      </p>
      <h2>
        1. Wer ist für die Datenverarbeitung verantwortlich und an wen können
        Sie sich wenden?
      </h2>
      <p>
        Für die Datenverarbeitung verantwortlich:
        <br />
        emotion banking GmbH
        <br />
        Marchetstraße 47
        <br />
        A-2500 Baden <br />
        E-Mail: office@emotion-banking.at
      </p>
      <p>
        Datenschutzbeauftragter der emotion banking GmbH:
        <br />
        Mag. Barbara Bauer
        <br />
        Marchetstraße 47
        <br />
        A-2500 Baden <br />
        E-Mail: barbara.bauer@emotion-banking.at <br />
        Tel. +43 22 52 25 48 45
      </p>

      <h2>
        2. Welche Daten werden verarbeitet und aus welchen Quellen stammen diese
        Daten?
      </h2>
      <p>
        Wir führen anonymisierte Befragungen durch. Dabei werden Daten erhoben,
        verarbeitet und gespeichert, aus denen aggregierte Berichte erstellt
        werden. Sollten persönliche Angaben wie z.B. Alter, Geschlecht oder
        Beruf abgefragt werden, so dienen diese Angaben ausschließlich
        statistischen Zwecken. Eine Identifizierung einzelner Personen anhand
        der getroffenen Aussagen ist nicht Ziel der Erhebungen. Da uns die
        Privatsphäre unserer Nutzer wichtig ist, werden die Nutzerdaten
        (IP-Adressen) bei Befragungen pseudonymisiert. Das bedeutet, dass wir
        Ihre Antworten (=pseudonymisierte Daten) getrennt von etwaigen
        Zuordnungsmerkmalen ablegen. Konkret: In der Marktforschungsdatenbank
        sind Ihre Antworten getrennt von Ihrer IP-Adresse bzw. den automatisch
        generierten Browserinformationen (siehe hierzu die Datenschutzerklärung
        der Homepage) abgelegt. Für die Berichtslegung werden ausschließlich von
        Ihnen abgegebene Antworten und Rückmeldungen herangezogen!
      </p>

      <h2>
        3. Für welche Zwecke und auf welcher Rechtsgrundlage werden die Daten
        verarbeitet?
      </h2>
      <p>
        Die Datenverarbeitung erfolgt auf Basis der gesetzlichen Bestimmungen
        des Art. 6 Abs. 1 lit a der DSGVO.
      </p>
      <p>
        Der unmittelbare Zweck der Datenverarbeitung besteht vorrangig in der
        Erstellung von Auswertungen, Berichten, Studien und Präsentationen, die
        Entscheidungsträgern dabei helfen, auf Basis der vorliegenden
        Informationen Entscheidungen zu treffen oder Erkenntnisse zu gewinnen.
        Dafür werden Aussagen anonymisiert und aggregiert und mittels
        statistischer Verfahren ausgewertet.
      </p>

      <h2>4. Wer erhält Ihre Daten?</h2>
      <p>
        Innerhalb der emotion banking GmbH erhalten diejenigen Mitarbeiterinnen
        und Mitarbeiter Ihre Daten, die diese zur Erfüllung der vertraglichen,
        gesetzlichen und aufsichtsrechtlichen Pflichten sowie zur Wahrung
        berechtigter Interessen benötigen. Sämtliche Mitarbeiter sind zur
        Verschwiegenheit – auch über das Ende des Dienstverhältnisses
        hinausgehend – verpflichtet. Sämtliche Auftragsverarbeiter und
        Sublieferanten der emotion banking GmbH (insbesondere IT- Dienstleister)
        sind vertraglich entsprechend dazu verpflichtet, Ihre Daten ebenso
        vertraulich zu behandeln und nur im Rahmen der beauftragten
        Leistungserbringung zu verarbeiten.
      </p>

      <h2>5. Wie lange werden Ihre Daten gespeichert und verarbeitet?</h2>
      <p>
        Für die Dauer der gesamten Geschäftsbeziehung (von der Anbahnung über
        die Abwicklung bis hin zur Beendigung eines Vertrags) sowie darüber
        hinaus gemäß den gesetzlichen Aufbewahrungs- und
        Dokumentationspflichten.
      </p>
      <p>
        Zudem sind bei der Speicherdauer die gesetzlichen Verjährungsfristen,
        die z.B. nach dem Allgemeinen Bürgerlichen Gesetzbuch (ABGB) in
        bestimmten Fällen bis zu 30 Jahre (die allgemeine Verjährungsfrist
        beträgt 3 Jahre) betragen können, zu berücksichtigen.
      </p>

      <h2>6. Welche Datenschutzrechte stehen Ihnen zu?</h2>
      <p>
        Sie nehmen an der Befragung freiwillig teil und haben:
        <br />
        -das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der
        Verarbeitung Ihrer gespeicherten Daten <br />
        -ein Widerspruchsrecht gegen die Verarbeitung
        <br />
        -ein Recht auf Datenübertragbarkeit gemäß den Voraussetzungen des
        Datenschutzrechts
      </p>

      <h2>7. Cookies</h2>
      <p>
        Unsere Website verwendet sogenannte Cookies, um die Funktionalität zu
        gewährleisten. Wir nutzen nur technisch notwendige Cookies, die keine
        Wiedererkennung eines Website-Besuchers ermöglichen.
      </p>
      <p>
        Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten,
        dass er Sie über das Setzen von Cookies informiert und Sie dies nur im
        Einzelfall erlauben.
      </p>
      <p>
        Bei der Deaktivierung von Cookies kann die Funktionalität unserer
        Website eingeschränkt sein.
      </p>

      <h2>8. Datensicherheit</h2>
      <p>
        Ihre Datensicherheit ist unser höchstes Anliegen. Unser erklärtes Ziel
        ist es, alle erforderlichen technischen und organisatorischen Maßnahmen
        zu treffen, um die Sicherheit der Datenverarbeitung zu gewährleisten und
        Ihre personenbezogenen Daten so zu verarbeiten, dass sie vor Zugriffen
        durch unbefugte Dritte geschützt sind.
      </p>
      <p>
        Durch die Verwendung von Sicherheitssoftware und
        Verschlüsselungsverfahren entspricht unsere IT-Infrastruktur den
        internationalen Sicherheitsstandards.
      </p>
      <p>
        Zusätzlich fördern wir die Sicherheit Ihrer Daten durch den Einsatz
        risikominimierender Maßnahmen und präventiver Schutzvorkehrungen.
      </p>

      <h2>
        Wir danken Ihnen für Ihr Mitwirken und für Ihr Vertrauen in unsere
        Arbeit.
      </h2>
    </Container>
  );
};
export default InfoText;
