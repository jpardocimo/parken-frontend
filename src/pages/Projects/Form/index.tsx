import React, { useState, useEffect, useCallback } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';

import api from '../../../services/api';

import Input from '../../../components/FormInput';
import Select from '../../../components/SelectForm';
import Button from '../../../components/Button';

import { Container } from './styles';

interface Customer {
  customerId: number;
  name: string;
}

interface Project {
  name: string;
  customerId: number;
  customerName: string;
  startYear: string;

  /// STYLES
  browserTitle: string;
  buttonsColor: string;
  urlFavicon: string;
  overlayBoxColor: string;
  urlLogo: string;
  urlRadarChart: string;
  headerColor: string;
  // widthLogo: string;
  heightLogo: string;

  headerImagePath?: string;
  headerImageId?: number;
}

interface Props {
  formRef: React.Ref<FormHandles>;
  buttonText: string;
  initialData?: Project;
  handleSubmit: SubmitHandler;
  customerData?: Customer;
}

interface SelectProps {
  value: number;
  label: string;
}

const FormProject: React.FC<Props> = props => {
  const [selectedIndustry, setSelectedIndustry] = useState<SelectProps>();
  const [selectedSector, setSelectedSector] = useState<SelectProps>();
  const [selectedFinancialSector, setSelectedFinancialSector] =
    useState<SelectProps>();
  const [selectedAsset, setSelectedAsset] = useState<SelectProps>();
  const [selectedRevenue, setSelectedRevenue] = useState<SelectProps>();
  const [selectedEmployeeNumber, setSelectedEmployeeNumber] =
    useState<SelectProps>();
  const [customers, setCustomers] = useState<SelectProps[]>();
  const [industries, setIndustries] = useState<SelectProps[]>();
  const [sectors, setSectors] = useState<SelectProps[]>();
  const [financialSectors, setFinancialSectors] = useState<SelectProps[]>();
  const [assets, setAssets] = useState<SelectProps[]>();
  const [revenues, setRevenues] = useState<SelectProps[]>();
  const [employees, setEmployees] = useState<SelectProps[]>();
  /// STYLES
  const [styles, setStyles] = useState<SelectProps[]>();
  const [logos, setLogos] = useState<SelectProps[]>();
  const [images, setImages] = useState<SelectProps[]>();
  const [browserTitle, setBrowserTitle] = useState<string>('');
  const [urlFavicon, setUrlFavicon] = useState<string>('');
  const [buttonsColor, setButtonsColor] = useState<string>('');
  const [overlayBoxColor, setOverlayBoxColor] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('');
  const [urlLogo, setUrlLogo] = useState<string>('');
  const [headerImagePath, setHeaderImagePath] = useState<string | undefined>(
    '',
  );
  const [urlRadarChart, setUrlRadarChart] = useState<string>('');
  const [server, setServer] = useState<string>('');
  const [headerIsColor, setHeaderIsColor] = useState<boolean>(true);
  // const [widthLogo, setWidthLogo] = useState<string>('');
  const [heightLogo, setHeightLogo] = useState<string>('');

  const [headerType, setHeaderType] = useState<SelectProps[]>();

  useEffect(() => {
    if (props.initialData) {
      setBrowserTitle(props.initialData.browserTitle);
      setUrlFavicon(props.initialData.urlFavicon);
      setButtonsColor(props.initialData.buttonsColor);
      setOverlayBoxColor(props.initialData.overlayBoxColor);
      setUrlLogo(props.initialData.urlLogo);
      setHeaderImagePath(props.initialData.headerImagePath);
      setUrlRadarChart(props.initialData.urlRadarChart);

      if (props.initialData?.headerImagePath) {
        setHeaderImagePath(props.initialData.headerImagePath);
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

      setHeaderColor(props.initialData.headerColor);
      // setWidthLogo(props.initialData?.widthLogo);
      setHeightLogo(props.initialData?.heightLogo);
    } else {
      setBrowserTitle('Emotion Banking');
      const prefix = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const serverFavicon = `${prefix}://${window.location.host}`;
      setUrlFavicon(`${serverFavicon}/favicon.ico`);
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
      setUrlRadarChart('/static/media/bg-radar-chart-pink.9da4933a.png');
      setButtonsColor('#FF780C');
      setOverlayBoxColor('#FF780C');

      setHeaderColor('#FF780C');
      // setWidthLogo('100%');
      setHeightLogo('100%');
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
    setHeaderType(HeaderTypeOptions);

    api.get('logos').then(response => {
      setServer(`${response.request?.responseURL.replace('/logos', '/files')}`);
      setLogos(
        response.data.map((logo: any) => {
          return {
            value: logo.logoId,
            label: logo.originalname,
            filePath: `${response.request?.responseURL.replace(
              '/logos',
              '/files',
            )}/${logo?.filename}`,
          };
        }),
      );
    });

    api.get('images').then(response => {
      setServer(
        `${response.request?.responseURL.replace('/images', '/files')}`,
      );
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

    api.get('customers').then(response => {
      setCustomers(
        response.data.map((customer: Customer) => {
          return {
            value: customer.customerId,
            label: customer.name,
          };
        }),
      );
    });

    api.get('projectsIndustries').then(response => {
      setIndustries(response.data);
    });

    api.get('projectsSectors').then(response => {
      setSectors(response.data);
    });

    api.get('projectsFinancialSectors').then(response => {
      setFinancialSectors(response.data);
    });

    api.get('projectsAssets').then(response => {
      setAssets(response.data);
    });

    api.get('projectsRevenues').then(response => {
      setRevenues(response.data);
    });

    api.get('projectsEmployees').then(response => {
      setEmployees(response.data);
    });
  }, [props.formRef, props.initialData, server]);

  const handleSectorChange = useCallback(selectedValue => {
    if (selectedValue.label !== 'Bank und Versicherung') {
      setSelectedSector(selectedValue);
    } else {
      setSelectedFinancialSector(selectedValue);
    }
  }, []);

  const handleIndustryChange = useCallback(
    selectedValue => {
      setSelectedIndustry(selectedValue);

      if (selectedValue.label !== 'Bank und Versicherung') {
        setSelectedSector({ label: 'none', value: -99 });
        setSelectedAsset({ label: 'none', value: -99 });
        setSectors(sectors);
      } else {
        setFinancialSectors(financialSectors);
        handleSectorChange(financialSectors);
      }
    },
    [financialSectors, handleSectorChange, sectors],
  );

  const handleTotalAssetsChange = useCallback(selectedValue => {
    setSelectedAsset(selectedValue);
  }, []);

  const handleRevenueChange = useCallback(selectedValue => {
    setSelectedRevenue(selectedValue);
  }, []);

  const handleEmployeesChange = useCallback(selectedValue => {
    setSelectedEmployeeNumber(selectedValue);
  }, []);

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

  const handleHeaderColorChange = useCallback(x => {
    setHeaderColor(x.target.value);
  }, []);

  // const handleWidthLogoChange = useCallback(x => {
  //   setWidthLogo(x.target.value);
  // }, []);

  const handleHeightLogoChange = useCallback(x => {
    setHeightLogo(x.target.value);
  }, []);

  const handleLogoChange = useCallback(x => {
    setUrlLogo(x.filePath);
  }, []);

  const handleHeaderImageChange = useCallback(x => {
    setHeaderImagePath(x.filePath);
  }, []);

  const handleUrlRadarChartChange = useCallback(x => {
    setUrlRadarChart(x.target.value);
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
          setUrlFavicon(`${serverFavicon}/favicon.ico`);
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
    [props.formRef, server],
  );

  return (
    <Container>
      <Form
        ref={props.formRef}
        initialData={props.initialData}
        onSubmit={props.handleSubmit}
      >
        <h2>Customer</h2>
        <Select
          name="customerId"
          options={customers}
          value={
            props.customerData && {
              value: props.customerData.customerId,
              label: props.customerData.name,
            }
          }
          isDisabled={!!props.customerData || !!props.initialData}
          placeholder="Select customer"
        />

        <h2>Name</h2>
        <Input type="text" name="name" placeholder="Enter project name" />

        <h2>Start Year</h2>
        <Input
          type="number"
          name="startYear"
          placeholder="Enter start year"
          maxLength={4}
        />

        <h2>Industry</h2>
        <Select
          name="industry"
          options={industries}
          onChange={e => handleIndustryChange(e)}
        />

        <>
          <h2>Sector</h2>
          <Select
            name="sector"
            options={
              selectedIndustry &&
              selectedIndustry.label === 'Bank und Versicherung'
                ? financialSectors
                : sectors
            }
            onChange={e => handleSectorChange(e)}
          />
        </>

        {selectedIndustry &&
        selectedIndustry.label === 'Bank und Versicherung' ? (
          <>
            <h2>Total Assets</h2>
            <Select
              name="asset"
              options={assets}
              onChange={e => handleTotalAssetsChange(e)}
            />
          </>
        ) : (
          <>
            <h2>Revenue</h2>
            <Select
              name="revenue"
              options={revenues}
              onChange={e => handleRevenueChange(e)}
            />
          </>
        )}

        <h2>Employees</h2>
        <Select
          name="employee"
          options={employees}
          onChange={e => handleEmployeesChange(e)}
        />

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
        <h2>Logo</h2>
        <Select
          name="logoId"
          options={logos}
          // defaultValue={logoDefaultSelected}
          onChange={e => handleLogoChange(e)}
          formatOptionLabel={logo => (
            <div className="logo-option">
              <img src={logo.filePath} alt="logo-image" />
              <span>{logo.label}</span>
            </div>
          )}
        />

        {/* <h2>Width Logo</h2>
        <Input
          type="text"
          name="widthLogo"
          placeholder="Enter width logo"
          maxLength={4}
          value={widthLogo}
          onChange={handleWidthLogoChange}
        /> */}

        <h2>Size Logo </h2>
        <Input
          type="text"
          name="heightLogo"
          placeholder="Enter height logo"
          value={heightLogo}
          onChange={handleHeightLogoChange}
        />

        <h2>Header</h2>
        <Select
          name="listHeadertype"
          options={headerType}
          defaultValue={{ label: 'Header with color', value: 1 }}
          onChange={e => handleHeaderTypeChange(e)}
        />

        <div hidden={!headerIsColor}>
          <h2>Header color</h2>
          <Input
            type="color"
            name="headerColor"
            value={headerColor}
            onChange={handleHeaderColorChange}
          />
        </div>

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

        <div hidden={true}>
          <h2>Url Logo</h2>
          <Input
            type="text"
            name="urlLogo"
            value={urlLogo}
            placeholder="Enter url logo to display in surveys"
            onChange={handleLogoChange}
          />

          <h2>Url Image</h2>
          <Input
            type="text"
            name="headerImagePath"
            value={headerImagePath}
            placeholder="Enter url image to display in surveys"
            onChange={handleHeaderImageChange}
          />

          <h2>Url Favicon</h2>
          <Input
            type="text"
            name="urlFavicon"
            placeholder="Enter url to display in browser tab"
            value={urlFavicon}
            onChange={handleUrlFaviconChange}
          />

          <h2>Url Radar Chart</h2>
          <Input
            type="text"
            name="urlRadarChart"
            value={urlRadarChart}
            placeholder="Enter url Radar Chart Image to display in analytics"
            onChange={handleUrlRadarChartChange}
          />
        </div>

        <Button type="submit" width="200px">
          {props.buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default FormProject;
