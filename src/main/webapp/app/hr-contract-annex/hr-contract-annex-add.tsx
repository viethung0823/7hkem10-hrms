import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HrContractAnnexDTO } from 'app/hr-contract-annex/hr-contract-annex-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    number: yup.string().emptyToNull().max(255),
    content: yup.string().emptyToNull().max(255),
    dateEfective: yup.string().emptyToNull(),
    contract: yup.number().integer().emptyToNull()
  });
}

export default function HrContractAnnexAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('hrContractAnnex.add.headline'));

  const navigate = useNavigate();
  const [contractValues, setContractValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const contractValuesResponse = await axios.get('/api/hrContractAnnexes/contractValues');
      setContractValues(contractValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createHrContractAnnex = async (data: HrContractAnnexDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/hrContractAnnexes', data);
      navigate('/hrContractAnnexes', {
            state: {
              msgSuccess: t('hrContractAnnex.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('hrContractAnnex.add.headline')}</h1>
      <div>
        <Link to="/hrContractAnnexes" className="btn btn-secondary">{t('hrContractAnnex.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHrContractAnnex)} noValidate>
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="name" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="number" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="content" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="dateEfective" type="datepicker" />
      <InputRow useFormResult={useFormResult} object="hrContractAnnex" field="contract" type="select" options={contractValues} />
      <input type="submit" value={t('hrContractAnnex.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
