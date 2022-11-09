import React, {
  TextareaHTMLAttributes,
  useEffect,
  useState,
  useRef,
} from 'react';
// import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import JoditEditor from 'jodit-react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  initialData: string;
}

const Input: React.FC<TextareaProps> = ({ name, initialData, ...rest }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);
  const [content, setContent] = useState('');

  const editor = useRef(null);

  const config = {
    readonly: false,
    fillEmptyParagraph: false,
    cleanHTML: {
      fillEmptyParagraph: false,
    },
  };

  useEffect(() => {
    setContent(initialData);

    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField, initialData]);

  return (
    <>
      <textarea
        hidden={true}
        value={content}
        readOnly={true}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={newContent => setContent(newContent)}
        onChange={newContent => {}}
      />
    </>
  );
};

export default Input;
