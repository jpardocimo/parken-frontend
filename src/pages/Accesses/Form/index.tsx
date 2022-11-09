import React, {
  useState,
  useEffect,
  useCallback,
  MouseEventHandler,
} from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';
import ReactExport from 'react-export-excel';

import { DeleteOutline } from '@material-ui/icons';

import { useLocation } from 'react-router-dom';
import api from '../../../services/api';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Switch from '../../../components/Switch';
import Button from '../../../components/Button';

import Table from '../../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../../components/DevExpressTable/ActionsColumn';
import { columns } from './columns';

import {
  Container,
  ButtonMd,
  BoxContainer,
  IptContainer,
  PlaceholderContainer,
  AddIcon,
} from './styles';
import TableRows from '../tableRows';
import { Hr } from '../styles';

const { ExcelFile } = ReactExport;
const { ExcelSheet } = ReactExport.ExcelFile;
const { ExcelColumn } = ReactExport.ExcelFile;

interface Access {
  accessId: number;
  surveyId: number;
  name: string;
  isLocked: boolean;
  segments: string[];
  results: Result[];
  placeholders: Placeholder[];
  subgroup: string;
}

interface Segment {
  name: string;
}

interface Result {
  resultId: number;
  code: string;
  createdByUser: boolean;
}

interface Placeholder {
  replaceValue: string;
  searchValue: string;
}

interface CodeLink {
  resultId: number;
  code: string;
  url: string;
  createdByUser: boolean;
  surveyId: number;
  surveyName: string;
  segmentNames: string;
  linkName: string;
  subgroup: string;
  accessId: number;
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: Access;
  handleSubmit: SubmitHandler;
  handleRemoveCode: (row: Result) => void;
  handleCreateCode?: MouseEventHandler<HTMLButtonElement>;
  isTemplate: boolean;
}

interface State {
  surveyName: string;
  subgroup: string;
}

const FormAccess: React.FC<Props> = props => {
  const [codeLinks, setCodeLinks] = useState<CodeLink[]>([]);
  const [segments, setSegments] = useState();
  const [isLocked, setIsLocked] = useState(props.initialData?.isLocked);
  const { state } = useLocation<State>();
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [tableColumnExtensions] = useState([
    { columnName: 'resultId', width: 120 },
    { columnName: 'url', width: 300 },
  ]);
  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'delete',
      label: '',
      onClick: props.handleRemoveCode,
      icon: <DeleteOutline />,
    },
  ]);

  useEffect(() => {
    const localCodeLinks: CodeLink[] = [];
    if (props && props.initialData) {
      props.initialData.results.forEach(result => {
        localCodeLinks.push({
          resultId: result.resultId,
          createdByUser: result.createdByUser,
          code: result.code,
          url: `https://${window.location.hostname}/questionnaire/${props?.initialData?.accessId}/${result.code}`,
          linkName: (props.initialData && props.initialData.name) ?? '',
          segmentNames: JSON.stringify(props.initialData?.segments),
          surveyName: state?.surveyName,
          surveyId: props.initialData?.surveyId ?? 0,
          subgroup: state?.subgroup,
          accessId: props.initialData?.accessId ?? 0,
        });
      });

      setCodeLinks(localCodeLinks);
    }
  }, [props, props.initialData, state]);

  useEffect(() => {
    const localIsLocked = props.initialData?.isLocked;
    setIsLocked(localIsLocked);

    if (props.isTemplate) {
      // Links must be locked for templates
      setIsLocked(true);
    }
  }, [props.initialData?.isLocked, props.isTemplate]);

  useEffect(() => {
    api.get('segments').then(response => {
      setSegments(
        response.data.map((segment: Segment) => {
          return {
            value: segment.name,
            label: segment.name,
          };
        }),
      );
    });
  }, []);

  const addTableRows = useCallback(() => {
    const rowsInput: Placeholder = {
      searchValue: '',
      replaceValue: '',
    };

    setRowsData([...rowsData, rowsInput]);
  }, [rowsData]);

  useEffect(() => {
    if (props.initialData?.placeholders)
      setRowsData(props.initialData?.placeholders);
  }, [props.initialData?.placeholders]);

  const deleteTableRows = useCallback(
    async (index: any) => {
      const rows = [...rowsData];
      rows.splice(index, 1);
      setRowsData(rows);
    },
    [rowsData],
  );

  const handleChange = useCallback(
    async (index, evnt) => {
      const { name, value } = evnt.target;
      const rowsInput = [...rowsData];
      rowsInput[index][name] = value;
      setRowsData(rowsInput);
    },
    [rowsData],
  );

  const handleSwitchChange = useCallback(value => {
    setIsLocked(value);
  }, []);

  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        <h2>Name</h2>
        <Input type="text" name="name" placeholder="Enter the name" />

        <h2>Participant Group</h2>
        <Select
          isMulti
          name="segments"
          options={segments}
          className="basic-multi-select"
        />

        <h2>Placeholder</h2>
        <div
          style={{
            margin: '1rem',
          }}
        >
          <div hidden={true}>
            <Input
              type="text"
              name="placeholders"
              value={JSON.stringify(rowsData)}
              placeholder="Enter the text to replace in the survey"
            />
          </div>

          <PlaceholderContainer>
            <table>
              <thead>
                <th>Text to be replaced</th>
                <th>Text to replace</th>

                <button onClick={addTableRows} type={'button'}>
                  <AddIcon></AddIcon>
                </button>
              </thead>

              <Hr></Hr>
              <tbody>
                <TableRows
                  rowsData={rowsData}
                  deleteTableRows={deleteTableRows}
                  handleChange={handleChange}
                ></TableRows>
              </tbody>
            </table>
          </PlaceholderContainer>
        </div>
        <h2>Unlock/Lock</h2>
        <Switch
          name="isLocked"
          initialValue={isLocked}
          handleSwitchChange={handleSwitchChange}
          disabled={props.isTemplate}
        />
        {!props.isTemplate && (
          <>
            {props.initialData?.results && (
              <>
                <h2>Codes</h2>
                <BoxContainer>
                  <IptContainer>
                    <Input
                      type="number"
                      name="numberCodes"
                      placeholder="Enter the number of codes to be generated"
                      width="80%"
                    />
                  </IptContainer>

                  <ButtonMd
                    variant="contained"
                    type="button"
                    onClick={props.handleCreateCode}
                  >
                    Generate
                  </ButtonMd>
                </BoxContainer>

                <ExcelFile
                  element={
                    <Button marginRight="35px" width="150px" height="40px">
                      Download
                    </Button>
                  }
                  filename={`Codes`}
                >
                  <ExcelSheet data={codeLinks} name="Codes">
                    <ExcelColumn label="ID" value="resultId" />
                    <ExcelColumn label="Access" value="accessId" />
                    <ExcelColumn label="Access Name" value="linkName" />
                    <ExcelColumn label="User Group" value="subgroup" />
                    <ExcelColumn label="Survey" value="surveyName" />
                    <ExcelColumn label="Code" value="code" />
                    <ExcelColumn label="Segments" value="segmentNames" />
                    <ExcelColumn label="URL" value="url" />
                    <ExcelColumn
                      label="Created By User"
                      value="createdByUser"
                    />
                    {/* <ExcelColumn label="User group" value="subgroup" /> */}
                  </ExcelSheet>
                </ExcelFile>

                <Table
                  columnsProp={columns}
                  dataProp={codeLinks}
                  checkboxSelection={false}
                  tableColumnExtensions={tableColumnExtensions}
                  actionColumns={actionColumns}
                  hasFilterRow={false}
                  idName={'resultId'}
                />
              </>
            )}
          </>
        )}

        <Button type="submit" width="200px">
          {props.buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default FormAccess;
