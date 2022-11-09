import React, { useState, useCallback, useEffect } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';

import api from '../../../services/api';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import MultiInput from '../../../components/MultiInput';
import Button from '../../../components/Button';

import EnumQuestionType from '../../../utils/enums/EnumQuestionType';

import { Container } from './styles';

interface Question {
  text: string;
  type: string;
  alternatives: Alternative[];
  options: Option[];
  tags: Tag[];
}

interface Type {
  value: string;
  label: string;
}

interface Alternative {
  value: number;
  text: string;
}

interface Option {
  value: number;
  text: string;
}

interface Tag {
  value: string;
  label: string;
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: Question;
  handleSubmit: SubmitHandler;
  isEdit?: boolean;
  questionId?: string;
}

const defaultOptions: Option[] = [
  { value: 1, text: 'trifft vollständig zu' },
  { value: 2, text: 'trifft weitgehend zu' },
  { value: 3, text: 'trifft bedingt zu' },
  { value: 4, text: 'trifft kaum zu' },
  { value: 5, text: 'trifft gar nicht zu' },
];

const FormQuestion: React.FC<Props> = props => {
  const [type, setType] = useState<Type>({
    value: '',
    label: 'Select...',
  } as Type);
  const [selectedTags, setSelectedTags] = useState([] as Tag[]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionTags, setQuestionTags] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [disableEditType, setDisableEditTYpe] = useState(false);

  useEffect(() => {
    api.get('questionTypes').then(response => {
      setQuestionTypes(response.data);
    });

    api.get('questionTags').then(response => {
      setQuestionTags(response.data);
    });

    if (props.isEdit) {
      const typeInit: Type = {
        value: props.initialData?.type ?? '',
        label:
          EnumQuestionType[
            props.initialData?.type as keyof typeof EnumQuestionType
          ],
      };

      setType(typeInit);
    }

    if (props.isEdit && props.questionId) {
      api
        .get(`/results/question/${props.questionId}/`)
        .then(responseQuestionBelongsToAnyResults => {
          if (responseQuestionBelongsToAnyResults.data) {
            setDisableEditTYpe(true);
          }
        });
    }
  }, [
    props.initialData,
    props.initialData?.type,
    props.isEdit,
    props.questionId,
  ]);

  const handleTypeChange = useCallback(selectedType => {
    setType(selectedType);
    setShowOptions(selectedType.value !== EnumQuestionType.Text);
  }, []);

  const handleTagChange = useCallback(tagsList => {
    setSelectedTags(tagsList);
  }, []);

  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        <h2>Text</h2>
        <Input type="text" name="text" placeholder="Enter question text" />

        <h2>Alternatives</h2>
        <MultiInput
          name="alternatives"
          width="100%"
          filledOptions={
            props.initialData?.alternatives &&
            props.initialData.alternatives.length > 0
              ? props.initialData?.alternatives
              : [{ value: 1, text: '' }]
          }
        />

        <h2>Type</h2>
        <Select
          name="type"
          value={type}
          options={questionTypes}
          onChange={e => handleTypeChange(e)}
          isDisabled={disableEditType}
        />

        {showOptions === true && (
          <>
            <h2>Options</h2>
            <MultiInput
              name="options"
              // disabled={props.isEdit} // TODO: BACK WITH IT
              disabled={false}
              filledOptions={
                props.initialData?.options ||
                (type.value === EnumQuestionType.Scale
                  ? defaultOptions
                  : [{ value: 1, text: '' }])
              }
            />
          </>
        )}

        <h2>Tags</h2>
        <Select
          isMulti
          name="tags"
          options={questionTags}
          className="basic-multi-select"
          onChange={e => handleTagChange(e)}
        />

        <Button type="submit" width="200px">
          {props.buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default FormQuestion;
