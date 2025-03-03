import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrJobTitleDTO } from 'app/hr-job-title/hr-job-title-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    code: yup.string().emptyToNull().max(255).required(),
    description: yup.string().emptyToNull().max(255)
  });
}

export default function HrJobTitleEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrJobTitle.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      HR_JOB_TITLE_CODE_UNIQUE: t('exists.hrJobTitle.code')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/hrJobTitles/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateHrJobTitle = async (data: HrJobTitleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/hrJobTitles/' + currentId, data);
      navigate('/hrJobTitles', {
            state: {
              msgSuccess: t('hrJobTitle.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrJobTitle.edit.headline')}</h1>
      <div>
        <Link to="/hrJobTitles" className="btn btn-secondary">{t('hrJobTitle.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateHrJobTitle)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="description" />
      <input type="submit" value={t('hrJobTitle.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
