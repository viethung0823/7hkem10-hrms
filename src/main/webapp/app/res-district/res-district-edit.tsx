import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResDistrictDTO } from 'app/res-district/res-district-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    code: yup.string().emptyToNull().max(255).required(),
    province: yup.number().integer().emptyToNull().required()
  });
}

export default function ResDistrictEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('resDistrict.edit.headline'));

  const navigate = useNavigate();
  const [provinceValues, setProvinceValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_DISTRICT_CODE_UNIQUE: t('exists.resDistrict.code')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const provinceValuesResponse = await axios.get('/api/resDistricts/provinceValues');
      setProvinceValues(provinceValuesResponse.data);
      const data = (await axios.get('/api/resDistricts/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateResDistrict = async (data: ResDistrictDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/resDistricts/' + currentId, data);
      navigate('/resDistricts', {
            state: {
              msgSuccess: t('resDistrict.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resDistrict.edit.headline')}</h1>
      <div>
        <Link to="/resDistricts" className="btn btn-secondary">{t('resDistrict.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateResDistrict)} noValidate>
      <InputRow useFormResult={useFormResult} object="resDistrict" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="resDistrict" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrict" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrict" field="province" required={true} type="select" options={provinceValues} />
      <input type="submit" value={t('resDistrict.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
