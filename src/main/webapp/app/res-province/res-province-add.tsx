import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function ResProvinceAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resProvince.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_PROVINCE_CODE_UNIQUE: t('exists.resProvince.code')
    };
    return messages[key];
  };

  const createResProvince = async (data: ResProvinceDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resProvinces', data);
      navigate('/resProvinces', {
            state: {
              msgSuccess: t('resProvince.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resProvince.add.headline')}</h1>
      <div>
        <Link to="/resProvinces" className="btn btn-secondary">{t('resProvince.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResProvince)} noValidate>
      <InputRow useFormResult={useFormResult} object="resProvince" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="resProvince" field="code" required={true} />
      <input type="submit" value={t('resProvince.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
