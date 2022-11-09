import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';

import { Link, useHistory } from 'react-router-dom';

import Input from '../../../../components/FormInput';
import Select from '../../../../components/SelectForm';
import Button from '../../../../components/Button';

import { Container } from './styles';

import api from '../../../../services/api';

interface Customer {
  customerId: number;
  name: string;
}

interface Header {
  id: number;
  filePath: string;
}

interface Style {
  urlFavicon: string;
  browserTitle: string;
  buttonsColor: string;
  overlayBoxColor: string;
  urlLogo: string;
  urlRadarChart: string;
  headerColor: string;
  heightLogo: string;
  headerImagePath?: string;
  headerImageId?: number;
  header: Header;
}
interface Survey {
  name: string;
  style: Style;
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: Survey;
  handleSubmit: SubmitHandler;
  customerData?: Customer;
}

interface SelectProps {
  value: number;
  label: string;
}

const FormStyle: React.FC<Props> = props => {
  const [styles, setStyles] = useState<SelectProps[]>();
  const [browserTitle, setBrowserTitle] = useState<string>('');
  const [urlFavicon, setUrlFavicon] = useState<string>('');
  const [buttonsColor, setButtonsColor] = useState<string>('#b31c1d');
  const [overlayBoxColor, setOverlayBoxColor] = useState<string>('#b31c1d');
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [urlRadarChart, setUrlRadarChart] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('#b31c1d');
  const [heightLogo, setHeightLogo] = useState<string>('');
  const [headerImagePath, setHeaderImagePath] = useState<string | undefined>(
    '',
  );
  const [images, setImages] = useState<SelectProps[]>();
  const [headerIsColor, setHeaderIsColor] = useState<boolean>(true);
  const [headerType, setHeaderType] = useState<SelectProps[]>();
  // const [server, setServer] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    if (props.initialData && props.initialData.style) {
      setBrowserTitle(props.initialData.style.browserTitle);
      setUrlFavicon(props.initialData.style.urlFavicon);
      setButtonsColor(props.initialData.style.buttonsColor);
      setOverlayBoxColor(props.initialData.style.overlayBoxColor);
      setUrlLogo(props.initialData.style.urlLogo);
      setUrlRadarChart(props.initialData.style.urlRadarChart);
      setHeaderColor(props.initialData.style.headerColor);
      // setWidthLogo(props.initialData?.widthLogo);
      setHeightLogo(props.initialData?.style.heightLogo);

      if (props.initialData?.style.header.filePath) {
        setHeaderImagePath(props.initialData.style.header.filePath);
        setHeaderIsColor(false);

        const formRefLocal: React.Ref<FormHandles> = props.formRef;
        if (formRefLocal) {
          const formHandles: any = formRefLocal;
          formHandles.current?.setFieldValue('listHeadertype', {
            value: 2,
            label: 'Header with image',
          });
        }
      } else {
        setHeaderIsColor(true);
      }
    }

    const stylesDefault: any = [
      {
        value: 1,
        label: 'Selbsttest TSÖ',
      },
      {
        value: 2,
        label: 'Emotion Banking',
      },
      {
        value: 3,
        label: 'Spirit Hoch Drei',
      },
      {
        value: 4,
        label: 'Kunde21',
      },
    ];
    setStyles(stylesDefault);

    const HeaderTypeOptions: any = [
      {
        value: 1,
        label: 'Header with color',
      },
      {
        value: 2,
        label: 'Header with image',
      },
    ];

    api.get('images').then(response => {
      setImages(
        response.data.map((img: any) => {
          return {
            value: img.logoId,
            label: img.originalname,
            filePath: `${response.request?.responseURL.replace(
              '/images',
              '/files',
            )}/${img?.filename}`,
          };
        }),
      );
    });

    setHeaderType(HeaderTypeOptions);
  }, [props.formRef, props.initialData]);

  const handleBrowserTitleChange = useCallback(x => {
    setBrowserTitle(x.target.value);
  }, []);
  const handleUrlFaviconChange = useCallback(x => {
    setUrlFavicon(x.target.value);
  }, []);
  const handleButtonsColorChange = useCallback(x => {
    setButtonsColor(x.target.value);
  }, []);
  const handleOverlayBoxColorChange = useCallback(x => {
    setOverlayBoxColor(x.target.value);
  }, []);
  const handleUrlLogoChange = useCallback(x => {
    setUrlLogo(x.target.value);
  }, []);

  const handleUrlRadarChartChange = useCallback(x => {
    setUrlRadarChart(x.target.value);
  }, []);

  const handleHeaderColorChange = useCallback(x => {
    setHeaderColor(x.target.value);
  }, []);

  const handleHeightLogoChange = useCallback(x => {
    setHeightLogo(x.target.value);
  }, []);

  const handleHeaderImageChange = useCallback(x => {
    setHeaderImagePath(x.filePath);
  }, []);

  const handleHeaderTypeChange = useCallback(x => {
    if (x.value === 1) {
      setHeaderImagePath('');
      setHeaderIsColor(true);
    }

    if (x.value === 2) {
      setHeaderIsColor(false);
      setHeaderImagePath('');
    }
  }, []);

  const handleStylesChange = useCallback(
    selectedValue => {
      const prefix = process.env.NODE_ENV === 'development' ? 'http' : 'https';

      const serverFavicon = `${prefix}://${window.location.host}`;

      const server = `${serverFavicon}/files`;

      switch (selectedValue.value) {
        case 1: {
          setBrowserTitle('Selbsttest TSÖ');
          setUrlFavicon(`${serverFavicon}/favicontso.ico`);
          setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
          setOverlayBoxColor('#b31c1d');
          setButtonsColor('#b31c1d');

          setHeaderColor('#b31c1d');
          // setWidthLogo('100%');
          setHeightLogo('100%');

          if (server.includes('localhost') || server.includes('homolog')) {
            const pathLogo = `${server}/f357c64e1ff3a5786bc4-Logo%20TS%C3%96%20transparenter%20HG.png`; // id=38
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 38,
              label: pathLogo,
              filePath: pathLogo,
            };

            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          } else {
            const pathLogo = `${server}/203e540f5dd20809256c-Logo%20TS%C3%96%20transparenter%20HG.png`; // id=41
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 41,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          }

          break;
        }
        case 2: {
          setBrowserTitle('Emotion Banking');
          setUrlFavicon(`${serverFavicon}/favicon.ico`);
          setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
          setButtonsColor('#FF780C');
          setOverlayBoxColor('#FF780C');
          setHeaderColor('#FF780C');
          // setWidthLogo('100%');
          setHeightLogo('100%');

          if (server.includes('localhost') || server.includes('homolog')) {
            const pathLogo = `${server}/02f10d4fd7e0b20493ef-1_Logo%20ohne%20Unterschrift.png`; // id= 34
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 34,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          } else {
            const pathLogo = `${server}/c24a8a5d2b870b93865e-1_Logo%20ohne%20Unterschrift.png`; // id= 44
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 44,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          }

          break;
        }
        case 3: {
          setBrowserTitle('Spirit Hoch');
          setUrlFavicon(`${serverFavicon}/faviconsp3.ico`);
          setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
          setButtonsColor('#ed1e79');
          setOverlayBoxColor('#ed1e79');
          setHeaderColor('#ed1e79');
          // setWidthLogo('100%');
          setHeightLogo('100%');

          if (server.includes('localhost') || server.includes('homolog')) {
            const pathLogo = `${server}/529a8b0ac5e562ad7b3c-spirit-hoch.webp`; // id=30
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 30,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          } else {
            const pathLogo = `${server}/529a8b0ac5e562ad7b3c-spirit-hoch.webp`; // id=30
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 30,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          }

          break;
        }
        case 4: {
          setBrowserTitle('Kunde 21');
          setUrlFavicon(`${serverFavicon}/favicon-kunde21.ico`);
          setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
          setButtonsColor('#00A19A');
          setOverlayBoxColor('#00A19A');
          setHeaderColor('#00A19A');
          // setWidthLogo('100%');
          setHeightLogo('100%');

          if (server.includes('localhost') || server.includes('homolog')) {
            const pathLogo = `${server}/5976efd805a020836612-logo-kunde21.png`;
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 41,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          } else {
            const pathLogo = `${server}/881b5bb3790f53126ec9-K21%20wei%C3%9F.png`; // id=30
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 54,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          }

          break;
        }
        default: {
          setBrowserTitle('Victor Neu');
          setUrlFavicon(`${serverFavicon}favicon.ico`);
          setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
          setButtonsColor('#1ab394');
          setOverlayBoxColor('#1ab394');

          setHeaderColor('#1ab394');
          // setWidthLogo('100%');
          setHeightLogo('100%');

          if (server.includes('localhost') || server.includes('homolog')) {
            const pathLogo = `${server}/02f10d4fd7e0b20493ef-1_Logo%20ohne%20Unterschrift.png`; // id= 34
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 34,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          } else {
            const pathLogo = `${server}/c24a8a5d2b870b93865e-1_Logo%20ohne%20Unterschrift.png`; // id= 44
            setUrlLogo(pathLogo);
            const logoDefault = {
              value: 44,
              label: pathLogo,
              filePath: pathLogo,
            };
            const formRefLocal: React.Ref<FormHandles> = props.formRef;
            if (formRefLocal) {
              const formHandles: any = formRefLocal;
              formHandles.current?.setFieldValue('logoId', logoDefault);
            }
          }
          break;
        }
      }
    },
    [props.formRef],
  );

  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        <h2>Styles</h2>
        <Select
          name="listStylesDefault"
          options={styles}
          defaultValue={{ label: 'Emotion Banking', value: 2 }}
          onChange={e => handleStylesChange(e)}
        />

        <h2>Browser Title</h2>
        <Input
          type="text"
          name="browserTitle"
          value={browserTitle}
          placeholder="Enter title to display in browser tab"
          onChange={handleBrowserTitleChange}
        />

        <h2>Buttons color</h2>
        <Input
          type="color"
          name="buttonsColor"
          value={buttonsColor}
          onChange={handleButtonsColorChange}
        />

        <h2>OverlayBox color</h2>
        <Input
          type="color"
          name="overlayBoxColor"
          value={overlayBoxColor}
          onChange={handleOverlayBoxColorChange}
        />

        <h2>Header</h2>
        <Select
          name="listHeadertype"
          options={headerType}
          defaultValue={{ label: 'Header with color', value: 1 }}
          onChange={e => handleHeaderTypeChange(e)}
        />

        <div hidden={headerIsColor}>
          <h2>Header Image</h2>
          <Select
            name="headerImageId"
            options={images}
            onChange={e => handleHeaderImageChange(e)}
            formatOptionLabel={img => (
              <div className="header-option">
                <img src={img.filePath} alt="header-image" />
                <span>{img.label}</span>
              </div>
            )}
          />
        </div>

        <div hidden={!headerIsColor}>
          <h2>Header color</h2>
          <Input
            type="color"
            name="headerColor"
            value={headerColor}
            onChange={handleHeaderColorChange}
          />

          <h2>Size Logo </h2>
          <Input
            type="text"
            name="heightLogo"
            placeholder="Enter height logo"
            value={heightLogo}
            onChange={handleHeightLogoChange}
          />
        </div>

        <div hidden={true}>
          <h2>Url Favicon</h2>
          <Input
            type="text"
            name="urlFavicon"
            placeholder="Enter url to display in browser tab"
            value={urlFavicon}
            onChange={handleUrlFaviconChange}
          />

          <h2>Url Logo</h2>
          <Input
            type="text"
            name="urlLogo"
            value={urlLogo}
            placeholder="Enter url logo to display in surveys"
            onChange={handleUrlLogoChange}
          />

          <h2>Url Image</h2>
          <Input
            type="text"
            name="headerImagePath"
            value={headerImagePath}
            placeholder="Enter url image to display in surveys"
            onChange={handleHeaderImageChange}
          />

          <h2>Url Radar Chart</h2>
          <Input
            type="text"
            name="urlRadarChart"
            value={urlRadarChart}
            placeholder="Enter url logo to display in surveys"
            onChange={handleUrlRadarChartChange}
          />
        </div>

        <Button width="120px" height="40px" marginRight="30px" type="submit">
          Confirm
        </Button>

        <Link to={''} onClick={history.goBack}>
          <Button width="120px" height="40px">
            Back
          </Button>
        </Link>
      </Form>
    </Container>
  );
};

export default FormStyle;
