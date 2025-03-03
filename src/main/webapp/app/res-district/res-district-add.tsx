import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function ResDistrictAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resDistrict.add.headline'));

  const navigate = useNavigate();
  const [provinceValues, setProvinceValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_DISTRICT_CODE_UNIQUE: t('exists.resDistrict.code')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const provinceValuesResponse = await axios.get('/api/resDistricts/provinceValues');
      setProvinceValues(provinceValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createResDistrict = async (data: ResDistrictDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resDistricts', data);
      navigate('/resDistricts', {
            state: {
              msgSuccess: t('resDistrict.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resDistrict.add.headline')}</h1>
      <div>
        <Link to="/resDistricts" className="btn btn-secondary">{t('resDistrict.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResDistrict)} noValidate>
      <InputRow useFormResult={useFormResult} object="resDistrict" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrict" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrict" field="province" required={true} type="select" options={provinceValues} />
      <input type="submit" value={t('resDistrict.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
