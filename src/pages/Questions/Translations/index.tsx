import React, { useCallback, useState } from 'react';

import * as fs from 'fs';

import { Container } from './styles';
import api from '../../../services/api';

interface FileRecord {
  questionId: string;
  questionTitle: string;
  choices: string[];
}

interface QuestionLanguage {
  languageName: string;
  translationVersion: string;
  translationDescription: string;
}

interface Option {
  value: string;
  text: string;
}

interface QuestionTranslation {
  questionId: string;
  title: string;
  options: Option[];
}

let fileReader: any;
const QuestionTranslations: React.FC = () => {
  // const [questionTranslation, setQuestionTranslation] =
  //   useState<QuestioTranslation>();
  const [fileRecords, setFileRecords] = useState<FileRecord[]>();
  const [text, setText] = useState<string[]>();
  const processLineByLine = useCallback((fileName: string) => {
    const fileStream = fs.createReadStream('input.txt');

    // const rl: any = readline.createInterface({
    //   input: fileStream,
    //   crlfDelay: Infinity,
    // });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    // rl.forEach((line: any) => {
    //   console.log(`Line from file: ${line}`);
    // });

    // for (const line of rl) {
    //   // Each line in input.txt will be successively available here as `line`.
    //   console.log(`Line from file: ${line}`);
    // }
  }, []);

  const cleanContent = (textLine: any): string[] => {
    const line = textLine.replace(/^\s*[\r\n]/gm, '');
    const array = line.split(new RegExp(/[\r\n]/gm));

    return array;
  };

  const handleFileRead = (e: any): void => {
    let content = fileReader.result;
    // let text = deleteLines(content, 3);
    content = cleanContent(content);
    // … do something with the 'content'
    setText(content);

    const questionTranslations: QuestionTranslation[] = content.map(
      (line: any) => {
        const lineSplitted = line.split(new RegExp(/[@]/gm));

        const options =
          lineSplitted.length > 2
            ? lineSplitted[2].split(new RegExp(/[;]/gm))
            : [];

        return {
          questionId: lineSplitted[0],
          text: lineSplitted[1],
          options: options.map((option: string) => {
            return {
              text: option,
            };
          }),
        };
      },
    );

    const language = {
      description: 'language English',
      version: '1.0',
      language: 'en',
      questionTranslations,
      createdBy: 'ailton.pardocimo@emotion-banking.at',
    };

    try {
      api.post('/questionLanguages', language);
    } catch (error) {
      console.log('Erro ao importar questions', error);
    }
  };

  const onChange = (e: any): void => {
    const file = e.target.files;
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file[0]);
  };

  return (
    <Container>
      <h1>Question Translations</h1>

      <div className="App">
        <div className="upload-btn-wrapper">
          {/* <button className="btn">Upload a file</button> */}
          <input type="file" name="myfile" onChange={onChange} />
        </div>
        <br />
        <ul>
          {text?.map((txt: string, i: number) => (
            <li key={i}>{txt}</li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default QuestionTranslations;
