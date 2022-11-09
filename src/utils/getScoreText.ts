export default function getDefaultQuestionType(score: number): string {
  if (score >= 9) {
    return 'WOW, gratuliere, Sie sind auf einem ausgezeichneten Weg. Schön, dass es Organisationen gibt, die verstanden haben, dass Mensch und Materie eine Einheit bilden. Bleiben Sie so achtsam und entwickeln Sie sich voran.';
  }
  if (score < 9 && score > 4) {
    return 'Ihre Organisation hat Potenzial für Großes. Sie sind ja ganz flott unterwegs, aber stolpern immer wieder über die gleichen Themen und Engpässe. Geben Sie nicht auf, sondern spielen Sie das Spiel neu.';
  }
  if (score <= 4) {
    return 'Jetzt aber ran ans Thema! Sie wissen, dass es in vielen Bereichen Potentiale gibt. Warten Sie nicht, bis es eng wird, sondern handeln Sie heute. Packen Sie die Marathonaufgabe beherzt und konsequent, jedoch nicht überstürzt an!';
  }

  return 'Es konnten noch keine Scores berechnet werden, da noch keine Daten vorliegen.';
}
