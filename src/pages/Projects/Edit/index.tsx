import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../../services/api';

import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';

import FormProject from '../Form';

interface Project {
  name: string;
  customerId: number;
  customerName: string;
  startYear: string;
  industry: SelectProps;
  sector: SelectProps;
  employee: SelectProps;
  asset: SelectProps;
  urlFavicon: string;
  browserTitle: string;
  buttonsColor: string;
  overlayBoxColor: string;
  urlLogo: string;
  urlRadarChart: string;
  logoId?: number;

  headerColor: string;
  // widthLogo: string;
  heightLogo: string;
  headerImagePath: string;
  headerImageId?: number;
}

interface ParamTypes {
  projectId: string;
}

interface SelectProps {
  value: number;
  label: string;
}

const CreateProject: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { projectId } = useParams<ParamTypes>();
  const [project, setProject] = useState<Project>();
  const history = useHistory();

  useEffect(() => {
    api.get(`/projects/${projectId}`).then(response => {
      const proj = response.data;

      if (response.data.style) {
        proj.urlFavicon = response.data.style.urlFavicon;
        proj.browserTitle = response.data.style.browserTitle;
        proj.buttonsColor = response.data.style.buttonsColor;
        proj.overlayBoxColor = response.data.style.overlayBoxColor;
        proj.urlLogo = response.data.style.urlLogo;
        proj.urlRadarChart = response.data.style.urlRadarChart;
        proj.headerColor = response.data.style.headerColor;
        // proj.widthLogo = response.data.style.widthLogo;
        proj.heightLogo = response.data.style.heightLogo;

        if (response.data.style.header) {
          proj.headerImagePath = response.data.style?.header.filePath;
          proj.headerImageId = response.data.style?.header.id;
        }
      }

      setProject(proj);

      formRef.current?.setFieldValue('customerId', {
        value: response.data.customerId,
        label: response.data.customerName,
      });

      formRef.current?.setFieldValue('industry', {
        value: response.data?.industry?.value,
        label: response.data?.industry?.label,
      });

      formRef.current?.setFieldValue('sector', {
        value: response.data?.sector?.value,
        label: response.data?.sector?.label,
      });

      formRef.current?.setFieldValue('revenue', {
        value: response.data?.revenue?.value,
        label: response.data?.revenue?.label,
      });

      formRef.current?.setFieldValue('employee', {
        value: response.data?.employee?.value,
        label: response.data?.employee?.label,
      });

      if (response.data && response.data.style) {
        formRef.current?.setFieldValue(
          'browserTitle',
          response.data?.style.browserTitle,
        );

        formRef.current?.setFieldValue(
          'buttonsColor',
          response.data?.buttonsColor,
        );

        formRef.current?.setFieldValue(
          'overlayBoxColor',
          response.data?.overlayBoxColor,
        );

        formRef.current?.setFieldValue('urlFavicon', response.data?.urlFavicon);

        formRef.current?.setFieldValue(
          'urlLogo',
          response.data?.style?.logo?.filePath,
        );

        formRef.current?.setFieldValue(
          'headerImagePath',
          response.data?.style?.header?.filePath,
        );

        formRef.current?.setFieldValue(
          'headerColor',
          response.data?.style?.headerColor,
        );
        // formRef.current?.setFieldValue(
        //   'widthLogo',
        //   response.data?.style?.widthLogo,
        // );
        formRef.current?.setFieldValue(
          'heightLogo',
          response.data?.style?.heightLogo,
        );

        const logoFilePath: string = response.data?.style?.logo?.filePath;
        const logoFileLabel: string = logoFilePath?.substring(
          logoFilePath.lastIndexOf('/') + 1,
        );

        formRef.current?.setFieldValue('logoId', {
          value: response.data?.style?.logo?.id,
          filePath: logoFilePath,
          label: logoFileLabel,
        });

        const headerFilePath: string = response.data?.style?.header?.filePath;
        const headerFieldLabel: string = headerFilePath?.substring(
          headerFilePath.lastIndexOf('/') + 1,
        );

        formRef.current?.setFieldValue('headerImageId', {
          value: response.data?.style?.header?.id,
          filePath: headerFilePath,
          label: headerFieldLabel,
        });

        formRef.current?.setFieldValue(
          'urlRadarChart',
          response.data?.urlRadarChart,
        );
      }
    });
  }, [projectId]);

  const handleSubmit = useCallback(
    async (data: Project) => {
      try {
        formRef.current?.setErrors({});

        const industry: SelectProps =
          formRef.current?.getFieldRef('industry').select?.state
            ?.selectValue[0];

        const sector =
          formRef.current?.getFieldRef('sector').select?.state?.selectValue[0];

        const asset =
          formRef.current?.getFieldRef('asset').select?.state?.selectValue[0];

        const revenue =
          formRef.current?.getFieldRef('revenue').select?.state?.selectValue[0];

        const employee =
          formRef.current?.getFieldRef('employee').select?.state
            ?.selectValue[0];

        const projectData = {
          name: data.name,
          startYear: data.startYear,
          industry,
          sector,
          asset,
          revenue,
          employee,
          logoId: data.logoId,
          urlLogo: data.urlLogo,
          urlFavicon: data?.urlFavicon,
          browserTitle: data?.browserTitle,
          buttonsColor: data?.buttonsColor,
          overlayBoxColor: data?.overlayBoxColor,
          urlRadarChart: data?.urlRadarChart,

          headerColor: data?.headerColor,
          // widthLogo: data?.widthLogo,
          heightLogo: data?.heightLogo,

          headerImageId: data?.headerImageId,
          headerImagePath: data?.headerImagePath,
        };

        const schema = Yup.object().shape({
          name: Yup.string().required('Project name is required'),
        });

        await schema.validate(projectData, {
          abortEarly: false,
        });

        await api.put(`/projects/${projectId}`, projectData);

        history.push('/projects');

        addToast({
          type: 'success',
          title: 'Success',
          description: 'The project was saved successfully!',
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
            'An error occurred while editing project, please try again.',
        });
      }
    },
    [addToast, history, projectId],
  );

  return (
    <>
      <h1>Edit Project</h1>

      <FormProject
        formRef={formRef}
        handleSubmit={handleSubmit}
        initialData={project}
        buttonText="Save"
      />
    </>
  );
};

export default CreateProject;
