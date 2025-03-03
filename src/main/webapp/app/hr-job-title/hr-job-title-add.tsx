import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function HrJobTitleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrJobTitle.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      HR_JOB_TITLE_CODE_UNIQUE: t('exists.hrJobTitle.code')
    };
    return messages[key];
  };

  const createHrJobTitle = async (data: HrJobTitleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/hrJobTitles', data);
      navigate('/hrJobTitles', {
            state: {
              msgSuccess: t('hrJobTitle.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrJobTitle.add.headline')}</h1>
      <div>
        <Link to="/hrJobTitles" className="btn btn-secondary">{t('hrJobTitle.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHrJobTitle)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="code" required={true} />
      <InputRow useFormResult={useFormResult} object="hrJobTitle" field="description" />
      <input type="submit" value={t('hrJobTitle.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
