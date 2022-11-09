import EnumQuestionType from './enums/EnumQuestionType';

export default function getDefaultQuestionType(questionType: string): string {
  const questionTypeWithoutSpaces = questionType.replace(/\s/g, '');

  switch (questionTypeWithoutSpaces) {
    case Object.keys(EnumQuestionType)[
      Object.values(EnumQuestionType).indexOf(EnumQuestionType.Text)
    ]:
      return 'text';
    case Object.keys(EnumQuestionType)[
      Object.values(EnumQuestionType).indexOf(EnumQuestionType.Scale)
    ]:
      return 'radiogroup';
    case Object.keys(EnumQuestionType)[
      Object.values(EnumQuestionType).indexOf(EnumQuestionType.SelectOne)
    ]:
      return 'radiogroup';
    case Object.keys(EnumQuestionType)[
      Object.values(EnumQuestionType).indexOf(EnumQuestionType.SelectMultiple)
    ]:
      return 'checkbox';
    default:
      return 'radiogroup';
  }
}
