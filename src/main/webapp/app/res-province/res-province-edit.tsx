import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResProvinceDTO } from 'app/res-province/res-province-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    code: yup.string().emptyToNull().max(255).required()
  });
}

export default function ResProvinceEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('resProvince.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_PROVINCE_CODE_UNIQUE: t('exists.resProvince.code')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/resProvinces/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateResProvince = async (data: ResProvinceDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/resProvinces/' + currentId, data);
      navigate('/resProvinces', {
            state: {
              msgSuccess: t('resProvince.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resProvince.edit.headline')}</h1>
      <div>
        <Link to="/resProvinces" className="btn btn-secondary">{t('resProvince.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateResProvince)} noValidate>
      <InputRow useFormResult={useFormResult} object="resProvince" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="resProvince" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="resProvince" field="code" required={true} />
      <input type="submit" value={t('resProvince.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
