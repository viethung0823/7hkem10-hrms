import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrJobPositionDTO } from 'app/hr-job-position/hr-job-position-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    isRecruiting: yup.bool(),
    targetRecruitment: yup.number().integer().emptyToNull(),
    jobSummary: yup.string().emptyToNull(),
    company: yup.number().integer().emptyToNull().required(),
    department: yup.number().integer().emptyToNull(),
    location: yup.number().integer().emptyToNull()
  });
}

export default function HrJobPositionAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrJobPosition.add.headline'));

  const navigate = useNavigate();
  const [companyValues, setCompanyValues] = useState<Map<number,string>>(new Map());
  const [departmentValues, setDepartmentValues] = useState<Map<number,string>>(new Map());
  const [locationValues, setLocationValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const companyValuesResponse = await axios.get('/api/hrJobPositions/companyValues');
      setCompanyValues(companyValuesResponse.data);
      const departmentValuesResponse = await axios.get('/api/hrJobPositions/departmentValues');
      setDepartmentValues(departmentValuesResponse.data);
      const locationValuesResponse = await axios.get('/api/hrJobPositions/locationValues');
      setLocationValues(locationValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createHrJobPosition = async (data: HrJobPositionDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/hrJobPositions', data);
      navigate('/hrJobPositions', {
            state: {
              msgSuccess: t('hrJobPosition.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrJobPosition.add.headline')}</h1>
      <div>
        <Link to="/hrJobPositions" className="btn btn-secondary">{t('hrJobPosition.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHrJobPosition)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="name" />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="isRecruiting" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="targetRecruitment" type="number" />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="jobSummary" type="textarea" />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="company" required={true} type="select" options={companyValues} />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="department" type="select" options={departmentValues} />
      <InputRow useFormResult={useFormResult} object="hrJobPosition" field="location" type="select" options={locationValues} />
      <input type="submit" value={t('hrJobPosition.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
