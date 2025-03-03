import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function ResUserRoleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('resUserRole.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createResUserRole = async (data: ResUserRoleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/resUserRoles', data);
      navigate('/resUserRoles', {
            state: {
              msgSuccess: t('resUserRole.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('resUserRole.add.headline')}</h1>
      <div>
        <Link to="/resUserRoles" className="btn btn-secondary">{t('resUserRole.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResUserRole)} noValidate>
      <InputRow useFormResult={useFormResult} object="resUserRole" field="name" />
      <input type="submit" value={t('resUserRole.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
