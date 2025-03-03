import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResUserDTO } from 'app/res-user/res-user-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    username: yup.string().emptyToNull().max(255).required(),
    password: yup.string().emptyToNull().max(255),
    name: yup.string().emptyToNull().max(255),
    role: yup.array(yup.number().required()).emptyToNull().json()
  });
}

export default function ResUserAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUser.add.headline'));

  const navigate = useNavigate();
  const [roleValues, setRoleValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_USER_USERNAME_UNIQUE: t('exists.resUser.username')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const roleValuesResponse = await axios.get('/api/resUsers/roleValues');
      setRoleValues(roleValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createResUser = async (data: ResUserDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resUsers', data);
      navigate('/resUsers', {
            state: {
              msgSuccess: t('resUser.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUser.add.headline')}</h1>
      <div>
        <Link to="/resUsers" className="btn btn-secondary">{t('resUser.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResUser)} noValidate>
      <InputRow useFormResult={useFormResult} object="resUser" field="username" required={true} />
      <InputRow useFormResult={useFormResult} object="resUser" field="password" />
      <InputRow useFormResult={useFormResult} object="resUser" field="name" />
      <InputRow useFormResult={useFormResult} object="resUser" field="role" type="multiselect" options={roleValues} />
      <input type="submit" value={t('resUser.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
