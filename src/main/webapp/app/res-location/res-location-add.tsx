import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResLocationDTO } from 'app/res-location/res-location-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    latitude: yup.number().integer().emptyToNull(),
    longitude: yup.number().integer().emptyToNull(),
    street: yup.string().emptyToNull().max(255),
    districWard: yup.number().integer().emptyToNull(),
    province: yup.number().integer().emptyToNull(),
    district: yup.string().emptyToNull().uuid()
  });
}

export default function ResLocationAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resLocation.add.headline'));

  const navigate = useNavigate();
  const [districWardValues, setDistricWardValues] = useState<Map<number,string>>(new Map());
  const [provinceValues, setProvinceValues] = useState<Map<number,string>>(new Map());
  const [districtValues, setDistrictValues] = useState<Record<string,string>>({});

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_LOCATION_DISTRIC_WARD_UNIQUE: t('Exists.resLocation.distric-ward')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const districWardValuesResponse = await axios.get('/api/resLocations/districWardValues');
      setDistricWardValues(districWardValuesResponse.data);
      const provinceValuesResponse = await axios.get('/api/resLocations/provinceValues');
      setProvinceValues(provinceValuesResponse.data);
      const districtValuesResponse = await axios.get('/api/resLocations/districtValues');
      setDistrictValues(districtValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createResLocation = async (data: ResLocationDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resLocations', data);
      navigate('/resLocations', {
            state: {
              msgSuccess: t('resLocation.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resLocation.add.headline')}</h1>
      <div>
        <Link to="/resLocations" className="btn btn-secondary">{t('resLocation.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResLocation)} noValidate>
      <InputRow useFormResult={useFormResult} object="resLocation" field="name" />
      <InputRow useFormResult={useFormResult} object="resLocation" field="latitude" type="number" />
      <InputRow useFormResult={useFormResult} object="resLocation" field="longitude" type="number" />
      <InputRow useFormResult={useFormResult} object="resLocation" field="street" />
      <InputRow useFormResult={useFormResult} object="resLocation" field="districWard" type="select" options={districWardValues} />
      <InputRow useFormResult={useFormResult} object="resLocation" field="province" type="select" options={provinceValues} />
      <InputRow useFormResult={useFormResult} object="resLocation" field="district" type="select" options={districtValues} />
      <input type="submit" value={t('resLocation.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
