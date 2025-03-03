import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrContractDTO } from 'app/hr-contract/hr-contract-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    code: yup.string().emptyToNull().max(255),
    dateFrom: yup.string().emptyToNull(),
    dateTo: yup.string().emptyToNull(),
    salary: yup.string().emptyToNull().max(255),
    status: yup.object().emptyToNull().json(),
    employee: yup.number().integer().emptyToNull(),
    contractType: yup.number().integer().emptyToNull().required(),
    jobPosition: yup.number().integer().emptyToNull().required(),
    jobTitle: yup.number().integer().emptyToNull().required(),
    department: yup.number().integer().emptyToNull().required(),
    company: yup.number().integer().emptyToNull().required()
  });
}

export default function HrContractAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContract.add.headline'));

  const navigate = useNavigate();
  const [employeeValues, setEmployeeValues] = useState<Map<number,string>>(new Map());
  const [contractTypeValues, setContractTypeValues] = useState<Map<number,string>>(new Map());
  const [jobPositionValues, setJobPositionValues] = useState<Map<number,string>>(new Map());
  const [jobTitleValues, setJobTitleValues] = useState<Map<number,string>>(new Map());
  const [departmentValues, setDepartmentValues] = useState<Map<number,string>>(new Map());
  const [companyValues, setCompanyValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const employeeValuesResponse = await axios.get('/api/hrContracts/employeeValues');
      setEmployeeValues(employeeValuesResponse.data);
      const contractTypeValuesResponse = await axios.get('/api/hrContracts/contractTypeValues');
      setContractTypeValues(contractTypeValuesResponse.data);
      const jobPositionValuesResponse = await axios.get('/api/hrContracts/jobPositionValues');
      setJobPositionValues(jobPositionValuesResponse.data);
      const jobTitleValuesResponse = await axios.get('/api/hrContracts/jobTitleValues');
      setJobTitleValues(jobTitleValuesResponse.data);
      const departmentValuesResponse = await axios.get('/api/hrContracts/departmentValues');
      setDepartmentValues(departmentValuesResponse.data);
      const companyValuesResponse = await axios.get('/api/hrContracts/companyValues');
      setCompanyValues(companyValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createHrContract = async (data: HrContractDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/hrContracts', data);
      navigate('/hrContracts', {
            state: {
              msgSuccess: t('hrContract.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContract.add.headline')}</h1>
      <div>
        <Link to="/hrContracts" className="btn btn-secondary">{t('hrContract.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHrContract)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrContract" field="name" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="code" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="dateFrom" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="dateTo" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="salary" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="status" type="textarea" />
      <InputRow useFormResult={useFormResult} object="hrContract" field="employee" type="select" options={employeeValues} />
      <InputRow useFormResult={useFormResult} object="hrContract" field="contractType" required={true} type="select" options={contractTypeValues} />
      <InputRow useFormResult={useFormResult} object="hrContract" field="jobPosition" required={true} type="select" options={jobPositionValues} />
      <InputRow useFormResult={useFormResult} object="hrContract" field="jobTitle" required={true} type="select" options={jobTitleValues} />
      <InputRow useFormResult={useFormResult} object="hrContract" field="department" required={true} type="select" options={departmentValues} />
      <InputRow useFormResult={useFormResult} object="hrContract" field="company" required={true} type="select" options={companyValues} />
      <input type="submit" value={t('hrContract.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
