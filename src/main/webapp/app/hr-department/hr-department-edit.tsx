import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrDepartmentDTO } from 'app/hr-department/hr-department-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    code: yup.string().emptyToNull().max(255).required(),
    name: yup.string().emptyToNull().max(255).required(),
    parent: yup.number().integer().emptyToNull(),
    company: yup.number().integer().emptyToNull().required()
  });
}

export default function HrDepartmentEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrDepartment.edit.headline'));

  const navigate = useNavigate();
  const [parentValues, setParentValues] = useState<Map<number,string>>(new Map());
  const [companyValues, setCompanyValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      HR_DEPARTMENT_CODE_UNIQUE: t('exists.hrDepartment.code')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const parentValuesResponse = await axios.get('/api/hrDepartments/parentValues');
      setParentValues(parentValuesResponse.data);
      const companyValuesResponse = await axios.get('/api/hrDepartments/companyValues');
      setCompanyValues(companyValuesResponse.data);
      const data = (await axios.get('/api/hrDepartments/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateHrDepartment = async (data: HrDepartmentDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/hrDepartments/' + currentId, data);
      navigate('/hrDepartments', {
            state: {
              msgSuccess: t('hrDepartment.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrDepartment.edit.headline')}</h1>
      <div>
        <Link to="/hrDepartments" className="btn btn-secondary">{t('hrDepartment.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateHrDepartment)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrDepartment" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="hrDepartment" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="hrDepartment" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="hrDepartment" field="parent" type="select" options={parentValues} />
      <InputRow useFormResult={useFormResult} object="hrDepartment" field="company" required={true} type="select" options={companyValues} />
      <input type="submit" value={t('hrDepartment.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
