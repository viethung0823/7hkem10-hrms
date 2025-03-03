import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrContractTypeDTO } from 'app/hr-contract-type/hr-contract-type-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    code: yup.string().emptyToNull().max(255),
    isUnlimited: yup.bool(),
    isProbationaryContract: yup.bool()
  });
}

export default function HrContractTypeAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractType.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createHrContractType = async (data: HrContractTypeDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/hrContractTypes', data);
      navigate('/hrContractTypes', {
            state: {
              msgSuccess: t('hrContractType.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractType.add.headline')}</h1>
      <div>
        <Link to="/hrContractTypes" className="btn btn-secondary">{t('hrContractType.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHrContractType)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrContractType" field="name" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="code" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="isUnlimited" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="isProbationaryContract" type="checkbox" />
      <input type="submit" value={t('hrContractType.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
