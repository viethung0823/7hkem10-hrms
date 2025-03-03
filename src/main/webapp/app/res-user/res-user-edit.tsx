import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function ResUserEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUser.edit.headline'));

  const navigate = useNavigate();
  const [roleValues, setRoleValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      RES_USER_USERNAME_UNIQUE: t('exists.resUser.username')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const roleValuesResponse = await axios.get('/api/resUsers/roleValues');
      setRoleValues(roleValuesResponse.data);
      const data = (await axios.get('/api/resUsers/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateResUser = async (data: ResUserDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/resUsers/' + currentId, data);
      navigate('/resUsers', {
            state: {
              msgSuccess: t('resUser.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUser.edit.headline')}</h1>
      <div>
        <Link to="/resUsers" className="btn btn-secondary">{t('resUser.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateResUser)} noValidate>
      <InputRow useFormResult={useFormResult} object="resUser" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="resUser" field="username" required={true} />
      <InputRow useFormResult={useFormResult} object="resUser" field="password" />
      <InputRow useFormResult={useFormResult} object="resUser" field="name" />
      <InputRow useFormResult={useFormResult} object="resUser" field="role" type="multiselect" options={roleValues} />
      <input type="submit" value={t('resUser.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
