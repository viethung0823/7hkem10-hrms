import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function HrContractTypeEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractType.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/hrContractTypes/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateHrContractType = async (data: HrContractTypeDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/hrContractTypes/' + currentId, data);
      navigate('/hrContractTypes', {
            state: {
              msgSuccess: t('hrContractType.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractType.edit.headline')}</h1>
      <div>
        <Link to="/hrContractTypes" className="btn btn-secondary">{t('hrContractType.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateHrContractType)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrContractType" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="name" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="code" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="isUnlimited" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="hrContractType" field="isProbationaryContract" type="checkbox" />
      <input type="submit" value={t('hrContractType.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
