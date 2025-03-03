import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrEmployeeDTO } from 'app/hr-employee/hr-employee-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    code: yup.string().emptyToNull().max(255).required(),
    email: yup.string().emptyToNull().max(255),
    workPhone: yup.string().emptyToNull().max(255),
    gender: yup.string().emptyToNull(),
    status: yup.object().emptyToNull().json(),
    dateJoin: yup.string().emptyToNull(),
    dateLeft: yup.string().emptyToNull().max(255),
    country: yup.string().emptyToNull().max(255),
    idNumber: yup.string().emptyToNull().max(255),
    idDate: yup.string().emptyToNull(),
    idAddress: yup.string().emptyToNull().max(255),
    birthday: yup.string().emptyToNull(),
    placeOfBirth: yup.string().emptyToNull().max(255),
    permanentAddress: yup.string().emptyToNull().max(255),
    currentAddress: yup.string().emptyToNull().max(255),
    passport: yup.string().emptyToNull().max(255),
    maritalStatus: yup.object().emptyToNull().json(),
    emergencyContact: yup.string().emptyToNull().max(255),
    emergencyPhone: yup.string().emptyToNull().max(255),
    socialInsuranceCode: yup.string().emptyToNull().max(255),
    taxCode: yup.string().emptyToNull().max(255),
    religion: yup.string().emptyToNull().max(255),
    isUnion: yup.bool(),
    company: yup.number().integer().emptyToNull().required(),
    department: yup.number().integer().emptyToNull().required(),
    jobPosition: yup.number().integer().emptyToNull().required(),
    jobTitle: yup.number().integer().emptyToNull().required(),
    province: yup.number().integer().emptyToNull().required(),
    district: yup.string().emptyToNull().uuid().required(),
    ward: yup.number().integer().emptyToNull().required(),
    user: yup.number().integer().emptyToNull().required(),
    manager: yup.number().integer().emptyToNull()
  });
}

export default function HrEmployeeEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrEmployee.edit.headline'));

  const navigate = useNavigate();
  const [companyValues, setCompanyValues] = useState<Map<number,string>>(new Map());
  const [departmentValues, setDepartmentValues] = useState<Map<number,string>>(new Map());
  const [jobPositionValues, setJobPositionValues] = useState<Map<number,string>>(new Map());
  const [jobTitleValues, setJobTitleValues] = useState<Map<number,string>>(new Map());
  const [provinceValues, setProvinceValues] = useState<Map<number,string>>(new Map());
  const [districtValues, setDistrictValues] = useState<Record<string,string>>({});
  const [wardValues, setWardValues] = useState<Map<number,string>>(new Map());
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());
  const [managerValues, setManagerValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      HR_EMPLOYEE_USER_UNIQUE: t('Exists.hrEmployee.user')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const companyValuesResponse = await axios.get('/api/hrEmployees/companyValues');
      setCompanyValues(companyValuesResponse.data);
      const departmentValuesResponse = await axios.get('/api/hrEmployees/departmentValues');
      setDepartmentValues(departmentValuesResponse.data);
      const jobPositionValuesResponse = await axios.get('/api/hrEmployees/jobPositionValues');
      setJobPositionValues(jobPositionValuesResponse.data);
      const jobTitleValuesResponse = await axios.get('/api/hrEmployees/jobTitleValues');
      setJobTitleValues(jobTitleValuesResponse.data);
      const provinceValuesResponse = await axios.get('/api/hrEmployees/provinceValues');
      setProvinceValues(provinceValuesResponse.data);
      const districtValuesResponse = await axios.get('/api/hrEmployees/districtValues');
      setDistrictValues(districtValuesResponse.data);
      const wardValuesResponse = await axios.get('/api/hrEmployees/wardValues');
      setWardValues(wardValuesResponse.data);
      const userValuesResponse = await axios.get('/api/hrEmployees/userValues');
      setUserValues(userValuesResponse.data);
      const managerValuesResponse = await axios.get('/api/hrEmployees/managerValues');
      setManagerValues(managerValuesResponse.data);
      const data = (await axios.get('/api/hrEmployees/' + currentId)).data;
      if (data.status) {
        data.status = JSON.stringify(data.status, undefined, 2);
      }
      if (data.maritalStatus) {
        data.maritalStatus = JSON.stringify(data.maritalStatus, undefined, 2);
      }
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateHrEmployee = async (data: HrEmployeeDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/hrEmployees/' + currentId, data);
      navigate('/hrEmployees', {
            state: {
              msgSuccess: t('hrEmployee.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrEmployee.edit.headline')}</h1>
      <div>
        <Link to="/hrEmployees" className="btn btn-secondary">{t('hrEmployee.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateHrEmployee)} noValidate>
      <input type="submit" value={t('hrEmployee.edit.headline')} className="btn btn-primary mt-4 mb-4" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="email" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="workPhone" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="gender" required={true} type="radio" options={{'MALE': 'MALE', 'FEMALE': 'FEMALE'}} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="status" type="textarea" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="dateJoin" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="dateLeft" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="country" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="idNumber" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="idDate" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="idAddress" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="birthday" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="placeOfBirth" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="permanentAddress" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="currentAddress" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="passport" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="maritalStatus" type="textarea" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="emergencyContact" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="emergencyPhone" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="socialInsuranceCode" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="taxCode" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="religion" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="isUnion" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="company" required={true} type="select" options={companyValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="department" required={true} type="select" options={departmentValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="jobPosition" required={true} type="select" options={jobPositionValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="jobTitle" required={true} type="select" options={jobTitleValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="province" required={true} type="select" options={provinceValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="district" required={true} type="select" options={districtValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="ward" required={true} type="select" options={wardValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="user" required={true} type="select" options={userValues} />
      <InputRow useFormResult={useFormResult} object="hrEmployee" field="manager" type="select" options={managerValues} />
      <input type="submit" value={t('hrEmployee.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
