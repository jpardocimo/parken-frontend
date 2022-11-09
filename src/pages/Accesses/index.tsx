import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReactExport from 'react-export-excel';

import { Form } from '@unform/web';
import Table from '../../components/DevExpressTable/DevExpressTable';

import { useToast } from '../../hooks/toast';
import { columns } from './columns';
import BackButton from '../../components/BackButton';
import { Container, Content, Button, Placeholder, AddIcon, Hr } from './styles';
import api from '../../services/api';
import TableRows from './tableRows';
import EnumProductSubGroup from '../../utils/enums/EnumProductSubGroup';

const { ExcelFile } = ReactExport;
const { ExcelSheet } = ReactExport.ExcelFile;
const { ExcelColumn } = ReactExport.ExcelFile;

interface Access {
  accessId: number;
  name: string;
  results: any;
  segments: string[];
  isLocked: boolean;
  surveyName: string;
  subgroup: string;
}

interface ParamTypes {
  surveyId: string;
}

interface State {
  surveyName: string;
  subgroup: string;
  pageTitle: string;
  isTemplate: boolean;
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
  placeholders: Placeholder[];
  subgroup: string;
  accessId: number;
}

interface Placeholder {
  replaceValue: string;
  searchValue: string;
}

const Accesses: React.FC = () => {
  const { addToast } = useToast();
  // const [codeLinks, setCodeLinks] = useState<CodeLink[]>([]);

  const [codeLinksDownloadAllCodes, setCodeLinksDownloadAllCodes] = useState<
    CodeLink[]
  >([]);

  const [accesses, setAccesses] = useState<Access[]>([]);
  const { surveyId } = useParams<ParamTypes>();
  const { state } = useLocation<State>();
  const [placeholderHidden, setPlaceholderHidden] = useState<boolean>(true);
  const [refreshGrid, setrefreshGrid] = useState<boolean>(true);
  const [rowsData, setRowsData] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [surveyIsLocked, setSurveyIsLocked] = useState<boolean>(false);
  const [surveyIsTemplate, setSurveyIsTemplate] = useState<boolean>(false);

  const [tableColumnExtensions] = useState([
    { columnName: 'accessId', width: 100 },
    { columnName: 'name', width: 300 },
  ]);

  const delay = (ms: any): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

  const handlePlaceholderButton = useCallback(() => {
    setPlaceholderHidden(!placeholderHidden);
  }, [placeholderHidden]);

  const addTableRows = useCallback(() => {
    const rowsInput: Placeholder = {
      searchValue: '',
      replaceValue: '',
    };

    setRowsData([...rowsData, rowsInput]);
  }, [rowsData]);

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

  const handleSubmit = useCallback(async () => {
    setPlaceholderHidden(!placeholderHidden); // hide formPlaceholder

    try {
      const placeholderParams = {
        idSurvey: Number(surveyId),
        placeholders: rowsData,
      };

      await api.put(
        `/accesses/placeholder/survey/${placeholderParams.idSurvey}`,
        placeholderParams,
      );

      addToast({
        type: 'success',
        title: 'Success',
        description: 'All accesses were saved successfully!',
      });

      setrefreshGrid(true);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        description:
          'An error occurred while editing the access, please try again.',
      });
    }
  }, [addToast, placeholderHidden, rowsData, surveyId]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await api.get(`/accesses/codes/${surveyId}`);
      const localCodeLinks: CodeLink[] = [];

      response.data.forEach((access: any) => {
        access.results?.forEach((result: any) => {
          localCodeLinks.push({
            resultId: result.resultId,
            createdByUser: result.createdByUser,
            code: result.code,
            url: `https://${window.location.host}/questionnaire/${access.accessId}/${result.code}`,
            linkName: access.name ?? '',
            segmentNames: JSON.stringify(access.segments),
            surveyName: state?.surveyName,
            surveyId: Number(surveyId),
            placeholders: result.placeholders,
            subgroup: state?.subgroup,
            accessId: result.accessId,
          });
        });
      });

      const localLinksDownloadAllCodes: CodeLink[] = [];
      response.data.forEach((accessData: any) => {
        const resultsByAccess = accessData.results?.filter(
          (x: any) => x.accessId === accessData.accessId,
        );

        resultsByAccess.forEach((result: CodeLink) => {
          localLinksDownloadAllCodes.push({
            resultId: result.resultId,
            createdByUser: result.createdByUser,
            code: result.code,
            url: `https://${window.location.host}/questionnaire/${accessData.accessId}/${result.code}`,
            linkName: accessData.name ?? '',
            segmentNames: JSON.stringify(accessData.segments),
            surveyName: state?.surveyName,
            surveyId: Number(surveyId),
            placeholders: result.placeholders,
            subgroup: state?.subgroup,
            accessId: result.accessId,
          });
        });
      });

      setCodeLinksDownloadAllCodes(localLinksDownloadAllCodes);
      // setCodeLinks(localCodeLinks);
      await delay(1000);
    }
    fetchData();
  }, [state, state?.subgroup, state?.surveyName, surveyId]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const surveyResponse = await api.get(`/surveys/${surveyId}`);
      const isTemplate = state
        ? state?.isTemplate
        : surveyResponse?.data?.isTemplate;

      setSurveyIsTemplate(isTemplate);

      if (state && state.pageTitle !== '') {
        setPageTitle(state?.pageTitle);
      } else if (surveyResponse && surveyResponse.data) {
        const subGroupName: string =
          Object.values(EnumProductSubGroup)[
            Object.keys(EnumProductSubGroup).indexOf(
              surveyResponse.data.subGroup ? surveyResponse.data.subGroup : '',
            )
          ];

        if (surveyResponse.data.isTemplate) {
          const title = `${surveyResponse.data.name} - ${subGroupName}`;
          setPageTitle(title);
        } else {
          const title = `${surveyResponse.data.projectName} - ${surveyResponse.data.name} - ${subGroupName}`;
          setPageTitle(title);
        }
      }

      if (
        surveyResponse &&
        surveyResponse.data &&
        surveyResponse.data?.isLocked === true
      ) {
        setSurveyIsLocked(true);
      } else {
        setSurveyIsLocked(false);
      }

      const response = await api.get(`/accesses/survey/${surveyId}`);
      const localAccessData: Access[] = [];

      // if there's no access, create a default one.
      if (response.data.length === 0) {
        const access = {
          name: 'Default Link',
          surveyId,
          isLocked: isTemplate,
        };

        await api.post('/accesses', access).then(async () => {
          const responseWithNewData = await api.get(
            `/accesses/survey/${surveyId}`,
          );
          responseWithNewData.data.forEach((element: Access) => {
            localAccessData.push({
              ...element,
              surveyName: state?.surveyName,
              subgroup: state?.subgroup,
            });
          });
          setAccesses(localAccessData);
        });
      } else {
        response.data.forEach((element: Access) => {
          localAccessData.push({
            ...element,
            surveyName: state?.surveyName,
            subgroup: state?.subgroup,
          });
        });
        setAccesses(localAccessData);
      }
      setrefreshGrid(false);
    }

    fetchData();
  }, [state?.surveyName, surveyId, refreshGrid, state?.subgroup, state]);

  return (
    <Container>
      <BackButton url={`/surveys/${surveyId}`} />
      <h1>Links</h1>
      <h2>{pageTitle}</h2>

      {!surveyIsLocked && (
        <Link to={`/surveys/${surveyId}/accesses/new`}>
          <Button variant="contained" type="button">
            New Link
          </Button>
        </Link>
      )}

      {!surveyIsTemplate && (
        <ExcelFile
          element={<Button>Download All Codes</Button>}
          filename={`Codes`}
        >
          <ExcelSheet data={codeLinksDownloadAllCodes} name="Codes">
            <ExcelColumn label="ID" value="resultId" />
            <ExcelColumn label="Access" value="accessId" />
            <ExcelColumn label="Access Name" value="linkName" />
            <ExcelColumn label="User Group" value="subgroup" />
            <ExcelColumn label="Survey" value="surveyName" />
            <ExcelColumn label="Code" value="code" />
            <ExcelColumn label="Segments" value="segmentNames" />
            <ExcelColumn label="URL" value="url" />
            <ExcelColumn label="Created By User" value="createdByUser" />
          </ExcelSheet>
        </ExcelFile>
      )}

      {!surveyIsLocked && (
        <Button
          variant="contained"
          type="button"
          onClick={handlePlaceholderButton}
        >
          Placeholder
        </Button>
      )}

      <div hidden={placeholderHidden}>
        <Placeholder>
          <Form
            // ref={placeholderformRef}
            // initialData={placeholderForm}
            onSubmit={handleSubmit}
          >
            <h2>Placeholder</h2>
            <div
              style={{
                margin: '1rem',
                //  backgroundColor: '#e0e0e0'
              }}
            >
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
            </div>

            <Button variant="contained" type="submit">
              Apply for all
            </Button>
          </Form>
        </Placeholder>
      </div>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={accesses}
          checkboxSelection={false}
          tableColumnExtensions={tableColumnExtensions}
          hasFilterRow={false}
          idName={'accessId'}
        />
      </Content>
    </Container>
  );
};

export default Accesses;
