import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResDistrictWardDTO } from 'app/res-district-ward/res-district-ward-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    code: yup.string().emptyToNull().max(255).required(),
    district: yup.string().emptyToNull().uuid().required()
  });
}

export default function ResDistrictWardAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resDistrictWard.add.headline'));

  const navigate = useNavigate();
  const [districtValues, setDistrictValues] = useState<Record<string,string>>({});

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_DISTRICT_WARD_CODE_UNIQUE: t('exists.resDistrictWard.code')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const districtValuesResponse = await axios.get('/api/resDistrictWards/districtValues');
      setDistrictValues(districtValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createResDistrictWard = async (data: ResDistrictWardDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resDistrictWards', data);
      navigate('/resDistrictWards', {
            state: {
              msgSuccess: t('resDistrictWard.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resDistrictWard.add.headline')}</h1>
      <div>
        <Link to="/resDistrictWards" className="btn btn-secondary">{t('resDistrictWard.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResDistrictWard)} noValidate>
      <InputRow useFormResult={useFormResult} object="resDistrictWard" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrictWard" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="resDistrictWard" field="district" required={true} type="select" options={districtValues} />
      <input type="submit" value={t('resDistrictWard.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
