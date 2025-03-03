import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResCompanyDTO } from 'app/res-company/res-company-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    address: yup.string().emptyToNull().max(255),
    phone: yup.string().emptyToNull().max(255),
    email: yup.string().emptyToNull().max(255),
    website: yup.string().emptyToNull().max(255),
    taxCode: yup.string().emptyToNull().max(255)
  });
}

export default function ResCompanyAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resCompany.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createResCompany = async (data: ResCompanyDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resCompanies', data);
      navigate('/resCompanies', {
            state: {
              msgSuccess: t('resCompany.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resCompany.add.headline')}</h1>
      <div>
        <Link to="/resCompanies" className="btn btn-secondary">{t('resCompany.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResCompany)} noValidate>
      <InputRow useFormResult={useFormResult} object="resCompany" field="name" />
      <InputRow useFormResult={useFormResult} object="resCompany" field="address" />
      <InputRow useFormResult={useFormResult} object="resCompany" field="phone" />
      <InputRow useFormResult={useFormResult} object="resCompany" field="email" />
      <InputRow useFormResult={useFormResult} object="resCompany" field="website" />
      <InputRow useFormResult={useFormResult} object="resCompany" field="taxCode" />
      <input type="submit" value={t('resCompany.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
