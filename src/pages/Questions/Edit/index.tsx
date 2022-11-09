import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import EnumQuestionType from '../../../utils/enums/EnumQuestionType';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormQuestion from '../Form';

import { BoxId } from './styles';

interface Question {
  externalId: number;
  text: string;
  type: string;
  alternatives: Alternative[];
  options: Option[];
  tags: Tag[];
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

interface ParamTypes {
  questionId: string;
}

const EditQuestion: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { questionId } = useParams<ParamTypes>();

  const [question, setQuestion] = useState<Question>();
  const history = useHistory();

  useEffect(() => {
    api.get(`/questions/${questionId}`).then(response => {
      setQuestion(response.data);
      formRef.current?.setFieldValue('type', {
        value: response.data.type,
        label:
          EnumQuestionType[response.data.type as keyof typeof EnumQuestionType],
      });
      formRef.current?.setFieldValue('tags', response.data.tags);
    });
  }, [questionId]);

  const handleSubmit = useCallback(
    async (data: Question) => {
      try {
        formRef.current?.setErrors({});

        const showOptions = data.type !== EnumQuestionType.Text;

        const schema = Yup.object().shape({
          text: Yup.string().required('Question text is required'),
          type: Yup.string().required('Question type is required'),
          options: showOptions
            ? Yup.array().required('The question options are required')
            : Yup.array(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put(`/questions/${questionId}`, data);

        history.push('/questions');

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The question was saved successfully!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Registration Error',
          description:
            'An error occurred while creating question, please try again.',
        });
      }
    },
    [addToast, questionId, history],
  );

  return (
    <>
      <h1>{`Edit Question`}</h1>
      <BoxId>
        <h3>{`Question Id: ${questionId}`} </h3>
        {question?.externalId && (
          <h3>{`External Id: ${question.externalId}`} </h3>
        )}
      </BoxId>
      <FormQuestion
        formRef={formRef}
        handleSubmit={handleSubmit}
        initialData={question}
        isEdit
        buttonText="Save"
        questionId={questionId}
      ></FormQuestion>
    </>
  );
};

export default EditQuestion;
