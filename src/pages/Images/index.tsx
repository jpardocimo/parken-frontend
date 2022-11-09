/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { randomBytes } from 'crypto';

import { FiCamera, FiCopy } from 'react-icons/fi';
import api from '../../services/api';
import getEncodedSurvey from '../../utils/getEncodedSurvey';

import Table from '../../components/DevExpressTable/DevExpressTable';
import { IActionColumn } from '../../components/DevExpressTable/ActionsColumn';
import { columns } from './columns';

import BackButton from '../../components/BackButton';
import ButtonEb from '../../components/Button';

import { Container, Content, ButtonUpload, DeleteIcon } from './styles';

import { useToast } from '../../hooks/toast';

interface Image {
  imageId: string;
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
  imageId?: string;
  survey: any;
}

interface ImageObj {
  id: string;
  filePath: string;
}

const Images: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const [images, setImages] = useState<Image[]>([]);
  const [removed, setRemoved] = useState(false);
  const [fileServerUrl, setFileServerUrl] = useState('');
  const { state } = useLocation<State>();
  const [selectedRowIds, setSelectedRowIds] = useState<any>([]);

  const [tableColumnExtensions] = useState([
    { columnFilteringEnabled: false },
    { columnName: 'imageId', width: 120 },
    { columnName: 'originalname', width: 800 },
    { columnName: 'image', width: 310, filteringEnabled: false },
    { columnName: 'copyUrl', width: 120, filteringEnabled: false },
    // { columnName: 'delete', width: 80 },
  ]);

  const handleClickUrlCopy = useCallback((row: any) => {
    navigator.clipboard.writeText(`${row.server}/${row.filename}`);
  }, []);

  const handleClickDelete = useCallback(
    (row: any) => {
      try {
        api.delete(`/images/${row.imageId}`).then(response => {
          setRemoved(true);
          if (row.imageId !== undefined) {
            row?.api?.updateRows([{ imageId: row.imageId, _action: 'delete' }]);
          }
        });
      } catch (err) {
        if (err) {
          addToast({
            type: 'error',
            title: 'Updating Error',
            description: `An error occurred while deleting this image, please try again.`,
          });
        }
      }
    },
    [addToast],
  );

  useEffect(() => {
    if (removed) {
      setRemoved(false);
      api.get('/images').then(response1 => {
        const imageList = response1.data.map((image: Image) => {
          return {
            ...image,
            imageId: image.imageId.toString(),
            server: response1.request?.responseURL.replace('/images', '/files'),
          };
        });
        setImages(imageList);
        addToast({
          type: 'success',
          title: 'Success',
          description: 'The image was deleted successfully!',
        });
      });
    }
  }, [addToast, removed]);

  const [actionColumns] = useState<IActionColumn[]>([
    {
      columnName: 'copyUrl',
      label: 'Copy',
      onClick: handleClickUrlCopy,
      icon: <FiCopy />,
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

    api.get('/images').then(response => {
      setImages(
        response.data.map((image: Image) => {
          return {
            ...image,
            imageId: image.imageId.toString(),
            server: response.request?.responseURL.replace('/images', '/files'),
          };
        }),
      );

      if (state?.imageId) {
        setSelectedRowIds([state.imageId]);
      }
    });
  }, [fileServerUrl, state?.imageId]);

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFileServerUrl(randomBytes.toString());
      let urlString = '';

      if (e.target.files) {
        const data = new FormData();

        data.append('image', e.target.files[0]);

        api.post(`/images`, data).then(response => {
          urlString = response.request?.responseURL.replace(
            '/images',
            '/files',
          );
          setFileServerUrl(urlString);

          addToast({
            type: 'success',
            title: 'Success',
            description: 'The image was uploaded successfully!',
          });
        });
      }
    },
    [addToast],
  );

  const handleConfirm = useCallback(async () => {
    try {
      const surveyJson = state?.survey;
      const selectedImage = images.find(l => l.imageId === selectedRowIds[0]);

      let image: ImageObj;
      if (selectedImage) {
        image = {
          id: selectedImage?.imageId.toString(),
          filePath: `${selectedImage?.server}/${selectedImage?.filename}`,
        };
      } else {
        throw Error;
      }

      const survey = {
        ...surveyJson,
        image,
      };

      const encodedSurveyTosave = getEncodedSurvey(JSON.stringify(survey));

      await api.put(`/surveys/${state?.surveyId}`, encodedSurveyTosave);

      history.push(`/surveys/${state?.surveyId}`);

      addToast({
        type: 'success',
        title: 'Success',
        description: 'The image was selected successfully!',
      });
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
    images,
    history,
    addToast,
    selectedRowIds,
  ]);

  return (
    <Container>
      {!!state?.select && <BackButton />}

      <h1>Images</h1>

      <ButtonUpload>
        <label htmlFor="image">
          Upload New Image <FiCamera />
          <input type="file" id="image" onChange={handleImageChange} />
        </label>
      </ButtonUpload>

      <Content>
        <Table
          columnsProp={columns}
          dataProp={images}
          selectionProp={selectedRowIds}
          multiSelection={false}
          setSelectedRowId={setSelectedRowIds}
          checkboxSelection={!!state?.select}
          tableColumnExtensions={tableColumnExtensions}
          actionColumns={actionColumns}
          hasFilterRow={true}
          idName={'imageId'}
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

export default Images;
