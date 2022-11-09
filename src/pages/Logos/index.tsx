/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { randomBytes } from 'crypto';

import { FiCamera } from 'react-icons/fi';
import api from '../../services/api';
import getEncodedSurvey from '../../utils/getEncodedSurvey';

import Table from '../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';
import { columns } from './columns';

import BackButton from '../../components/BackButton';
import ButtonEb from '../../components/Button';
import {
  Container,
  Content,
  ButtonUpload,
  DeleteIcon,
  UrlCopy,
} from './styles';

import { useToast } from '../../hooks/toast';

interface Logo {
  logoId: string;
  filename: string;
  name: string;
  url: string;
  imageType: string;
  isActive: boolean;
  server: string;
}

interface State {
  select: boolean;
  surveyId: number;
  logoId?: string;
  survey: any;
  pageTitle: string;
}

interface LogoObj {
  id: string;
  filePath: string;
}

const Logos: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [removed, setRemoved] = useState(false);
  const [fileServerUrl, setFileServerUrl] = useState('');
  const { state } = useLocation<State>();
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);

  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'logoId', width: 120 },
    { columnName: 'originalname', width: 800 },
    { columnName: 'logo', width: 310, filteringEnabled: false },
    { columnName: 'copyUrl', width: 200, filteringEnabled: false },
    // { columnName: 'delete', width: 80 },
  ]);

  const handleClickUrlCopy = useCallback((row: any) => {
    navigator.clipboard.writeText(`${row.server}/${row.filename}`);
  }, []);

  const handleClickDelete = useCallback(
    (row: any) => {
      try {
        api.delete(`/logos/${row.logoId}`).then(response => {
          setRemoved(true);
          if (row.logoId !== undefined) {
            row?.api?.updateRows([{ logoId: row.logoId, _action: 'delete' }]);
          }
        });
      } catch (err) {
        if (err) {
          addToast({
            type: 'error',
            title: 'Updating Error',
            description: `An error occurred while deleting logo, please try again.`,
          });
        }
      }
    },
    [addToast],
  );

  useEffect(() => {
    if (removed) {
      setRemoved(false);
      api.get('/logos').then(response1 => {
        const logoList = response1.data.map((logo: Logo) => {
          return {
            ...logo,
            logoId: logo.logoId.toString(),
            server: response1.request?.responseURL.replace('/logos', '/files'),
          };
        });
        setLogos(logoList);
        addToast({
          type: 'success',
          title: 'Success',
          description: 'The logo was deleted successfully!',
        });
      });
    }
  }, [addToast, removed]);

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'copyUrl',
      label: 'Copy',
      onClick: handleClickUrlCopy,
      icon: <UrlCopy />,
    },
    // {
    //   columnName: 'delete',
    //   label: '',
    //   onClick: handleClickDelete,
    //   icon: <DeleteIcon />,
    // },
  ]);

  useEffect(() => {
    if (fileServerUrl) {
      const hack = '';
    }

    api.get('/logos').then(response => {
      setLogos(
        response.data.map((logo: Logo) => {
          return {
            ...logo,
            logoId: logo.logoId.toString(),
            server: response.request?.responseURL.replace('/logos', '/files'),
          };
        }),
      );

      if (state?.logoId) {
        setSelectedRowIds([state.logoId]);
      }
    });
  }, [fileServerUrl, state?.logoId]);

  const handleLogoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFileServerUrl(randomBytes.toString());
      let urlString = '';

      if (e.target.files) {
        const data = new FormData();

        data.append('logo', e.target.files[0]);

        api.post(`/logos`, data).then(response => {
          urlString = response.request?.responseURL.replace('/logos', '/files');
          setFileServerUrl(urlString);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The logo was uploaded successfully!',
          });
        });
      }
    },
    [addToast],
  );

  const handleConfirm = useCallback(async () => {
    try {
      const surveyJson = state?.survey;
      const selectedLogo = logos.find(l => l.logoId === selectedRowIds[0]);

      let logo: LogoObj;
      if (selectedLogo) {
        logo = {
          id: selectedLogo?.logoId.toString(),
          filePath: `${selectedLogo?.server}/${selectedLogo?.filename}`,
        };
      } else {
        throw Error;
      }

      const survey = {
        ...surveyJson,
        logo,
      };

      const encodedSurveyTosave = getEncodedSurvey(JSON.stringify(survey));

      const response = await api.put(
        `/surveys/${state?.surveyId}`,
        encodedSurveyTosave,
      );

      if (response?.data === null) {
        addToast({
          type: 'error',
          title: 'Updating Error',
          description: `This survey is locked. No changes were saved.`,
        });
      } else {
        history.push(`/surveys/${state?.surveyId}`);
        addToast({
          type: 'success',
          title: 'Success',
          description: 'The logo was selected successfully!',
        });
      }
    } catch (err) {
      if (err) {
        addToast({
          type: 'error',
          title: 'Updating Error',
          description: `An error occurred while updating survey, please try again.`,
        });
      }
    }
  }, [
    state?.survey,
    state?.surveyId,
    logos,
    history,
    addToast,
    selectedRowIds,
  ]);

  return (
    <Container>
      {!!state?.select && <BackButton />}

      <h1>Logos</h1>

      {state?.pageTitle && <h2>{state?.pageTitle}</h2>}

      <ButtonUpload>
        <label htmlFor="logo">
          Upload New Logo <FiCamera />
          <input type="file" id="logo" onChange={handleLogoChange} />
        </label>
      </ButtonUpload>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={logos}
          selectionProp={selectedRowIds}
          multiSelection={false}
          setSelectedRowId={setSelectedRowIds}
          checkboxSelection={!!state?.select}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'logoId'}
        ></Table>

        {!!state?.select && (
          <>
            <ButtonEb
              width="120px"
              height="40px"
              marginRight="30px"
              onClick={handleConfirm}
            >
              Confirm
            </ButtonEb>

            <Link to={''} onClick={history.goBack}>
              <ButtonEb width="120px" height="40px">
                Back
              </ButtonEb>
            </Link>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Logos;
