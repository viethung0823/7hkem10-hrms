import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResUserRoleDTO } from 'app/res-user-role/res-user-role-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255)
  });
}

export default function ResUserRoleEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUserRole.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/resUserRoles/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateResUserRole = async (data: ResUserRoleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/resUserRoles/' + currentId, data);
      navigate('/resUserRoles', {
            state: {
              msgSuccess: t('resUserRole.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUserRole.edit.headline')}</h1>
      <div>
        <Link to="/resUserRoles" className="btn btn-secondary">{t('resUserRole.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateResUserRole)} noValidate>
      <InputRow useFormResult={useFormResult} object="resUserRole" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="resUserRole" field="name" />
      <input type="submit" value={t('resUserRole.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
